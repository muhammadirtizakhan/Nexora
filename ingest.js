import dotenv from 'dotenv';
import fs from 'fs';
import mammoth from 'mammoth';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── Jina Embedding API ────────────────────────────────────
async function generateEmbedding(text) {
  const response = await fetch('https://api.jina.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.JINA_API_KEY}`
    },
    body: JSON.stringify({
      input: [text],
      model: 'jina-embeddings-v3',
      dimensions: 1024
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Jina API error: ${err}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

// ── Extract text from DOCX ────────────────────────────────
async function extractTextFromDocx(filePath) {
  console.log('📄 Extracting text from DOCX...');
  const result = await mammoth.extractRawText({ path: filePath });
  console.log(`✅ Text extracted — ${result.value.length} characters`);
  return result.value;
}

// ── Split text into chunks ────────────────────────────────
function chunkText(text, chunkSize = 400, overlap = 60) {
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .filter(s => s.trim().length > 10);

  const chunks = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).trim().length > chunkSize) {
      if (current.trim().length > 30) {
        chunks.push(current.trim());
      }
      const words = current.split(' ');
      current = words.slice(-overlap).join(' ') + ' ' + sentence;
    } else {
      current = current ? current + ' ' + sentence : sentence;
    }
  }

  if (current.trim().length > 30) {
    chunks.push(current.trim());
  }

  return chunks;
}

// ── Main ingest ───────────────────────────────────────────
async function ingest() {
  const docxPath = './Nexora_Updated.docx';

  if (!fs.existsSync(docxPath)) {
    console.error(`❌ File not found: ${docxPath}`);
    process.exit(1);
  }

  const text = await extractTextFromDocx(docxPath);
  const chunks = chunkText(text);
  console.log(`✂️  Total chunks created: ${chunks.length}`);

  console.log('🗑️  Clearing old embeddings from Supabase...');
  const { error: deleteError } = await supabase
    .from('nexora_docs')
    .delete()
    .neq('id', 0);

  if (deleteError) {
    console.error('❌ Delete error:', deleteError.message);
    process.exit(1);
  }
  console.log('✅ Old data cleared');

  console.log('🔄 Generating embeddings and storing in Supabase...');
  let successCount = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    process.stdout.write(`\r   Progress: ${i + 1}/${chunks.length}`);

    try {
      const embedding = await generateEmbedding(chunk);

      const { error } = await supabase
        .from('nexora_docs')
        .insert({ content: chunk, embedding });

      if (error) {
        console.error(`\n❌ Insert error on chunk ${i + 1}:`, error.message);
      } else {
        successCount++;
      }

      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      console.error(`\n❌ Error on chunk ${i + 1}:`, err.message);
    }
  }

  console.log(`\n✅ Ingest complete — ${successCount}/${chunks.length} chunks stored`);
  console.log('🚀 Knowledge base is ready!');
  process.exit(0);
}

ingest();