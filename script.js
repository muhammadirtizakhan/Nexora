// ================= FIREBASE IMPORTS =================
import { 
    auth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    sendPasswordResetEmail
} from './firebase-config.js';

// ================= IMPORT DATA FROM ASSETS =================
import { 
    featuresData, 
    projectsData, 
    pricingData, 
    faqsData, 
    githubLink,
    logos 
} from './assets.js';

// ============================================================
//  AUTH MODAL HELPERS
// ============================================================
function showAuthMessage(message, isError = false) {
    const existingMsg = document.querySelector('.auth-message');
    if (existingMsg) existingMsg.remove();
    
    const msgEl = document.createElement('div');
    msgEl.className = 'auth-message';
    msgEl.style.cssText = `padding:10px 12px;border-radius:8px;margin-bottom:14px;font-size:12px;font-weight:500;${
        isError 
        ? 'background:rgba(239,68,68,0.15);color:#fca5a5;border:1px solid rgba(239,68,68,0.3);' 
        : 'background:rgba(34,197,94,0.15);color:#86efac;border:1px solid rgba(34,197,94,0.3);'
    }`;
    msgEl.textContent = message;
    
    const authInner = document.getElementById('authInner');
    const brand = authInner?.querySelector('.auth-brand');
    if (brand) brand.insertAdjacentElement('afterend', msgEl);
    setTimeout(() => msgEl.remove(), 4000);
}

function setButtonLoading(btn, isLoading, originalText) {
    if (isLoading) {
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.innerHTML = '<div class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>Processing...';
    } else {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.innerHTML = originalText || 'Submit';
    }
}

// ============================================================
//  SIGN UP
// ============================================================
async function handleSignUp(event) {
    event.preventDefault();
    const form = document.querySelector('#tab-signup form');
    const nameInput  = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const passInput  = form.querySelector('input[type="password"]');
    const btn        = form.querySelector('button[type="submit"]');

    const fullName = nameInput.value.trim();
    const email    = emailInput.value.trim();
    const password = passInput.value;

    if (!fullName) { showAuthMessage('Please enter your full name', true); return; }
    if (!email || !email.includes('@')) { showAuthMessage('Please enter a valid email address', true); return; }
    if (password.length < 6) { showAuthMessage('Password must be at least 6 characters', true); return; }

    const orig = btn.innerHTML;
    setButtonLoading(btn, true, orig);
    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: fullName });
        showAuthMessage('Account created successfully! Welcome to Nexora! 🎉');
        nameInput.value = ''; emailInput.value = ''; passInput.value = '';
        setTimeout(() => { setButtonLoading(btn, false, orig); closeAuthModalFn(); }, 2000);
    } catch (err) {
        setButtonLoading(btn, false, orig);
        const msgs = {
            'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
            'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
            'auth/invalid-email': 'Invalid email format.',
        };
        showAuthMessage(msgs[err.code] || err.message || 'Sign up failed.', true);
    }
}

// ============================================================
//  SIGN IN
// ============================================================
async function handleSignIn(event) {
    event.preventDefault();
    const form       = document.querySelector('#tab-signin form');
    const emailInput = form.querySelector('input[type="email"]');
    const passInput  = form.querySelector('input[type="password"]');
    const btn        = form.querySelector('button[type="submit"]');

    const email    = emailInput.value.trim();
    const password = passInput.value;

    if (!email)    { showAuthMessage('Please enter your email', true); return; }
    if (!password) { showAuthMessage('Please enter your password', true); return; }

    const orig = btn.innerHTML;
    setButtonLoading(btn, true, orig);
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showAuthMessage('Signed in successfully! Welcome back! 🎉');
        emailInput.value = ''; passInput.value = '';
        setTimeout(() => { setButtonLoading(btn, false, orig); closeAuthModalFn(); }, 1500);
    } catch (err) {
        setButtonLoading(btn, false, orig);
        const msgs = {
            'auth/user-not-found':    'No account found with this email.',
            'auth/wrong-password':    'Incorrect password. Please try again.',
            'auth/invalid-credential':'Invalid email or password.',
            'auth/invalid-email':     'Invalid email format.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        };
        showAuthMessage(msgs[err.code] || 'Sign in failed. ' + err.message, true);
    }
}

// ============================================================
//  PROFILE UI
// ============================================================
function updateProfileUI(user) {
    const profileDropdown  = document.getElementById('profileDropdown');
    const signinBtns       = document.querySelectorAll('.signin-btn');
    const mobileProfileBtn = document.getElementById('mobileProfileBtn');

    if (user) {
        if (profileDropdown) { profileDropdown.classList.remove('hidden'); profileDropdown.style.display = 'block'; }
        if (mobileProfileBtn) { mobileProfileBtn.style.display = 'flex'; }
        signinBtns.forEach(b => { b.classList.add('hidden'); b.style.display = 'none'; });

        const displayName = user.displayName || user.email || 'User';
        const initial     = displayName.charAt(0).toUpperCase();

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('profileInitial', initial);
        set('profileName', displayName);
        set('profileEmail', user.email);
        set('mobileProfileInitial', initial);
        set('mobileProfileName', displayName);
        set('mobileProfileEmail', user.email);
        set('mobileProfileAvatarLarge', initial);
    } else {
        if (profileDropdown) { profileDropdown.classList.add('hidden'); profileDropdown.style.display = 'none'; }
        if (mobileProfileBtn) { mobileProfileBtn.style.display = 'none'; }
        signinBtns.forEach(b => { b.classList.remove('hidden'); b.style.display = 'block'; });
    }
}

onAuthStateChanged(auth, updateProfileUI);

// ============================================================
//  LOGOUT
// ============================================================
async function handleLogout() {
    try {
        await signOut(auth);
        const pm = document.getElementById('profileMenu');
        if (pm) pm.classList.add('hidden');
        showAuthMessage('Logged out successfully');
    } catch (err) {
        console.error('Logout error:', err);
    }
}

// ============================================================
//  CHANGE PASSWORD
// ============================================================
function openChangePasswordModal() {
    const m = document.getElementById('changePasswordModal');
    if (m) { m.style.opacity = '1'; m.style.pointerEvents = 'all'; m.classList.add('show'); }
}
function closeChangePasswordModal() {
    const m = document.getElementById('changePasswordModal');
    if (m) { m.style.opacity = '0'; m.style.pointerEvents = 'none'; m.classList.remove('show'); }
    const f = document.getElementById('changePasswordForm');
    if (f) f.reset();
}
async function handleChangePassword(event) {
    event.preventDefault();
    const cur  = document.getElementById('currentPassword').value;
    const nw   = document.getElementById('newPassword').value;
    const conf = document.getElementById('confirmPassword').value;
    if (nw !== conf) { alert('New passwords do not match'); return; }
    if (nw.length < 6) { alert('Password must be at least 6 characters'); return; }
    const user = auth.currentUser;
    if (!user?.email) { alert('Please sign in again'); return; }
    try {
        const cred = EmailAuthProvider.credential(user.email, cur);
        await reauthenticateWithCredential(user, cred);
        await updatePassword(user, nw);
        closeChangePasswordModal();
        alert('Password updated successfully!');
    } catch (err) {
        const msgs = {
            'auth/wrong-password':      'Current password is incorrect',
            'auth/requires-recent-login':'Please sign out and sign in again',
        };
        alert(msgs[err.code] || 'Failed: ' + err.message);
    }
}

// ============================================================
//  CHANGE PROFILE
// ============================================================
function openChangeProfileModal() {
    const m = document.getElementById('changeProfileModal');
    if (m) { m.style.opacity = '1'; m.style.pointerEvents = 'all'; m.classList.add('show'); }
    const cur  = document.getElementById('profileName')?.textContent || '';
    const inp  = document.getElementById('newProfileName');
    if (inp) inp.value = cur;
}
function closeChangeProfileModal() {
    const m = document.getElementById('changeProfileModal');
    if (m) { m.style.opacity = '0'; m.style.pointerEvents = 'none'; m.classList.remove('show'); }
    const f = document.getElementById('changeProfileForm');
    if (f) f.reset();
}
async function handleChangeProfile(event) {
    event.preventDefault();
    const newName = document.getElementById('newProfileName').value.trim();
    if (!newName) { alert('Please enter a name'); return; }
    const user = auth.currentUser;
    if (!user) { alert('Please sign in'); return; }
    try {
        await updateProfile(user, { displayName: newName });
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('profileName', newName);
        set('profileInitial', newName.charAt(0).toUpperCase());
        closeChangeProfileModal();
        alert('Profile name updated!');
    } catch (err) {
        alert('Failed: ' + err.message);
    }
}

// ============================================================
//  PROFILE DROPDOWN TOGGLE
// ============================================================
function toggleProfileMenu(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('profileMenu');
    if (!menu) return;
    const hidden = menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !hidden);
}

// ============================================================
//  AUTH MODAL
// ============================================================
const authModal = document.getElementById('authModal');
function openAuthModal() {
    if (authModal) { authModal.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeAuthModalFn() {
    if (authModal) { authModal.classList.remove('open'); document.body.style.overflow = ''; }
}
function switchTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    if (tabs[0]) tabs[0].classList.toggle('active', tab === 'signin');
    if (tabs[1]) tabs[1].classList.toggle('active', tab === 'signup');
    const sp = document.getElementById('tab-signin');
    const up = document.getElementById('tab-signup');
    if (sp) sp.classList.toggle('active', tab === 'signin');
    if (up) up.classList.toggle('active', tab === 'signup');
}

async function handleForgotPassword() {
    const email = prompt('Enter your email to reset password:');
    if (!email) return;
    try {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset email sent! Check your inbox.');
    } catch (err) {
        alert('Failed: ' + err.message);
    }
}

// ============================================================
//  DATA RENDERING
// ============================================================
function renderFeatures() {
    const el = document.getElementById('features');
    if (!el) return;
    el.innerHTML = featuresData.map(f => `
        <div class="p-6 rounded-xl space-y-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/20 max-w-80 md:max-w-66">
            ${f.icon}
            <h3 class="text-base font-medium">${f.title}</h3>
            <p class="text-slate-400 line-clamp-2">${f.description}</p>
        </div>
    `).join('');
}

function renderProjects() {
    const el = document.getElementById('projects-container');
    if (!el) return;
    el.innerHTML = projectsData.map(p => `
        <div class="card">
            <h2>${p.title}</h2>
            <p>${p.desc}</p>
            <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
            <div class="actions">
                <a href="${p.liveLink}" target="_blank">Live</a>
                <a href="${githubLink}" target="_blank">GitHub</a>
            </div>
        </div>
    `).join('');
}

function renderPricing() {
    const el = document.getElementById('pricing');
    if (!el) return;
    el.innerHTML = pricingData.map(plan => `
    <div class="p-6 rounded-2xl max-w-75 w-full shadow-[0px_4px_26px_rgba(0,0,0,0.08)] ${plan.mostPopular? 'relative pt-12 bg-gradient-to-b from-indigo-600 to-violet-600 text-white' : 'bg-white/50 dark:bg-gray-800/50 border border-slate-200 dark:border-slate-700 ring-1 ring-purple-500/20'}">
        ${plan.mostPopular ? `<div class="flex items-center text-xs gap-1 py-1.5 px-2 text-purple-600 absolute top-4 right-4 rounded bg-white font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/></svg>
            <p>Most Popular</p>
        </div>` : ''}
        <p class="font-medium ${plan.mostPopular ? 'text-white' : ''}">${plan.title}</p>
        <h4 class="text-3xl font-semibold mt-1 ${plan.mostPopular ? 'text-white' : ''}">RS ${plan.price}<span class="font-normal text-sm ${plan.mostPopular ? 'text-white' : 'text-slate-300'}">/package</span></h4>
        <hr class="my-8 ${plan.mostPopular ? 'border-gray-300' : 'border-slate-300 dark:border-slate-700'}" />
        <div class="space-y-2 ${plan.mostPopular ? 'text-white' : 'text-slate-600 dark:text-slate-300'}">
            ${plan.features.map(f => `
            <div class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${plan.mostPopular ? 'text-white' : 'text-purple-600'}"><path d="M20 6 9 17l-5-5"/></svg>
                <span>${f}</span>
            </div>`).join('')}
        </div>
        <button class="transition w-full py-3 rounded-lg font-medium mt-8 ${plan.mostPopular ? 'bg-white hover:bg-slate-100 text-slate-800' : 'bg-purple-600 hover:bg-purple-700 text-white'}">${plan.buttonText}</button>
    </div>`).join('');

    el.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('connect with us')) {
            btn.addEventListener('click', () => {
                document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    });
}

function renderFAQ() {
    const el = document.getElementById('faq-container');
    if (!el) return;
    el.innerHTML = faqsData.map((faq, i) => `
    <div class="border-b border-slate-300 dark:border-purple-900 py-4 cursor-pointer w-full" data-index="${i}">
        <div class="flex items-center justify-between">
            <h3 class="text-base font-medium">${faq.question}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 transition-transform duration-500 ease-in-out" data-chevron><path d="m6 9 6 6 6-6"/></svg>
        </div>
        <p class="faq-answer text-sm text-slate-600 dark:text-slate-300 transition-all duration-500 ease-in-out max-w-xl opacity-0 max-h-0 overflow-hidden -translate-y-2">${faq.answer}</p>
    </div>`).join('');

    const items = el.querySelectorAll(':scope > div');
    items.forEach(item => {
        item.addEventListener('click', () => {
            const answer  = item.querySelector('.faq-answer');
            const chevron = item.querySelector('[data-chevron]');
            const isOpen  = answer.classList.contains('opacity-100');
            items.forEach(i => {
                i.querySelector('.faq-answer').classList.remove('opacity-100','max-h-[500px]','translate-y-0','pt-4');
                i.querySelector('.faq-answer').classList.add('opacity-0','max-h-0','-translate-y-2');
                i.querySelector('[data-chevron]').classList.remove('rotate-180');
            });
            if (!isOpen) {
                answer.classList.add('opacity-100','max-h-[500px]','translate-y-0','pt-4');
                answer.classList.remove('opacity-0','max-h-0','-translate-y-2');
                chevron.classList.add('rotate-180');
            }
        });
    });
}

function renderLogoTrack() {
    const track = document.getElementById('logo-track');
    if (!track) return;
    track.innerHTML = [...logos, ...logos].map(name =>
        `<img class="mx-11" src="/assets/companies-logo/${name}.svg" alt="${name}" width="100" height="100" draggable="false" onerror="this.style.display='none'"/>`
    ).join('');
}

// ============================================================
//  CHATBOT
// ============================================================
const NEXORA_KNOWLEDGE = {
    services: 'We offer: Web Design & Development, E-commerce Store Setup, Business Branding & Logo Design, SEO & Digital Marketing, Custom Web Apps, and ongoing Website Maintenance.',
    pricing:  'Our packages start at affordable rates tailored for local businesses. We have Starter, Growth, and Enterprise plans. Connect with us via WhatsApp (+92 315 1196495) or the contact form for a custom quote!',
    contact:  'You can reach us at:\n📞 +92 315 1196495\n📧 nexoradevx@gmail.com\n📍 Karachi, Pakistan\n💬 WhatsApp: wa.me/923151196495',
    about:    'Nexora is a digital agency based in Karachi, Pakistan. We turn local businesses into digital success stories by personally visiting shops, understanding their story, and building stunning websites that bring more customers.',
    process:  'Our process: 1) Discovery call to understand your business, 2) Custom design mockup, 3) Development & testing, 4) Launch & handover, 5) Ongoing support.',
    default:  'Thanks for reaching out! I\'m the Nexora AI assistant. I can help with info about our services, pricing, process, and how to contact us. What would you like to know?'
};

function getNexoraResponse(msg) {
    const m = msg.toLowerCase();
    if (m.match(/servi|offer|do you|provide|work|build/))         return NEXORA_KNOWLEDGE.services;
    if (m.match(/pric|cost|fee|package|plan|how much|rate|pay/))  return NEXORA_KNOWLEDGE.pricing;
    if (m.match(/contact|reach|phone|email|whatsapp|number|locat|address|karachi/)) return NEXORA_KNOWLEDGE.contact;
    if (m.match(/about|nexora|who|team|company|agency/))          return NEXORA_KNOWLEDGE.about;
    if (m.match(/process|how.*work|step|timeline|deliver/))       return NEXORA_KNOWLEDGE.process;
    if (m.match(/hi|hello|hey|salam|assalam/))                    return '👋 Hello! Welcome to Nexora! How can I help you today?';
    if (m.match(/thank|thanks|shukr/))                            return 'You\'re welcome! 😊 Is there anything else I can help you with?';
    if (m.match(/bye|goodbye|khuda|take care/))                   return 'Goodbye! Feel free to come back anytime. Best of luck! 🚀';
    return NEXORA_KNOWLEDGE.default;
}

function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addChatMessage(text, isUser = false) {
    const msgs   = document.getElementById('chatMessages');
    const div    = document.createElement('div');
    div.className = `chat-msg ${isUser ? 'user' : 'bot'}`;

    // Format newlines
    const formatted = text.replace(/\n/g, '<br>');
    div.innerHTML = `
        <div class="chat-bubble">${formatted}</div>
        <div class="chat-time">${getCurrentTime()}</div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function showTyping(show) {
    const el = document.getElementById('chatTyping');
    if (el) el.style.display = show ? 'flex' : 'none';
    if (show) {
        const msgs = document.getElementById('chatMessages');
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
    }
}

async function sendMessage(text) {
    if (!text?.trim()) return;
    const input = document.getElementById('chatInput');
    if (input) input.value = '';

    // Remove quick buttons after first message
    const qb = document.querySelector('.chat-quick-btns');
    if (qb) qb.style.display = 'none';

    addChatMessage(text, true);
    showTyping(true);

    try {
      const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://nexora-chatbot.vercel.app';

const res = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await res.json();
        showTyping(false);
        addChatMessage(data.answer || 'Sorry, something went wrong.', false);

    } catch (err) {
        showTyping(false);
        addChatMessage('Sorry, I am unable to connect right now. Please try again later.', false);
        console.error('Chatbot error:', err);
    }
}
function initChatbot() {
    const toggleBtn = document.getElementById('chatbotToggle');
    const closeBtn  = document.getElementById('chatbotClose');
    const widget    = document.getElementById('chatbotWidget');
    const sendBtn   = document.getElementById('chatSend');
    const input     = document.getElementById('chatInput');
    const chatIcon  = toggleBtn?.querySelector('.chat-icon');
    const closeIcon = toggleBtn?.querySelector('.close-icon');

    if (!toggleBtn || !widget) return;

    function openChatbot() {
        widget.classList.add('open');
        widget.setAttribute('aria-hidden', 'false');
        toggleBtn.classList.add('active');
        if (chatIcon)  chatIcon.style.display  = 'none';
        if (closeIcon) closeIcon.style.display = 'block';
        setTimeout(() => input?.focus(), 300);
    }
    function closeChatbot() {
        widget.classList.remove('open');
        widget.setAttribute('aria-hidden', 'true');
        toggleBtn.classList.remove('active');
        if (chatIcon)  chatIcon.style.display  = 'block';
        if (closeIcon) closeIcon.style.display = 'none';
    }

    toggleBtn.addEventListener('click', () => {
        widget.classList.contains('open') ? closeChatbot() : openChatbot();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeChatbot);

    // Send on button click
    if (sendBtn) sendBtn.addEventListener('click', () => sendMessage(input?.value));

    // Send on Enter
    if (input) {
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input.value);
            }
        });
    }
}

// ============================================================
//  EXPOSE GLOBALS
// ============================================================
window.openAuthModal          = openAuthModal;
window.closeAuthModalFn       = closeAuthModalFn;
window.switchTab              = switchTab;
window.handleLogout           = handleLogout;
window.openChangePasswordModal  = openChangePasswordModal;
window.closeChangePasswordModal = closeChangePasswordModal;
window.openChangeProfileModal   = openChangeProfileModal;
window.closeChangeProfileModal  = closeChangeProfileModal;
window.toggleProfileMenu        = toggleProfileMenu;
window.handleForgotPassword     = handleForgotPassword;

// ============================================================
//  DOMContentLoaded
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Render data
    renderFeatures();
    renderProjects();
    renderPricing();
    renderFAQ();
    renderLogoTrack();

    // Init chatbot
    initChatbot();

    // Sign-in buttons
    document.querySelectorAll('.signin-btn').forEach(btn => {
        btn.addEventListener('click', e => { e.preventDefault(); openAuthModal(); });
    });

    // Auth modal close
    const closeAuthBtn = document.getElementById('closeAuthModal');
    const authModalBg  = document.getElementById('authModalBg');
    if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModalFn);
    if (authModalBg)  authModalBg.addEventListener('click', closeAuthModalFn);

    // Profile dropdown
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) profileBtn.addEventListener('click', toggleProfileMenu);

    // Change password form
    const cpf = document.getElementById('changePasswordForm');
    if (cpf) cpf.addEventListener('submit', handleChangePassword);

    // Change profile form
    const cprf = document.getElementById('changeProfileForm');
    if (cprf) cprf.addEventListener('submit', handleChangeProfile);

    // Sign in / sign up forms
    const signinForm = document.querySelector('#tab-signin form');
    const signupForm = document.querySelector('#tab-signup form');
    if (signinForm) signinForm.addEventListener('submit', handleSignIn);
    if (signupForm) signupForm.addEventListener('submit', handleSignUp);

    // Close profile dropdown on outside click
    document.addEventListener('click', e => {
        const btn  = document.getElementById('profileBtn');
        const menu = document.getElementById('profileMenu');
        if (btn && menu && !btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.add('hidden');
        }
    });

    // Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeAuthModalFn();
            closeChangePasswordModal();
            closeChangeProfileModal();
        }
    });

    // Mobile menu
    const openMenu   = document.getElementById('openMenu');
    const closeMenu  = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const navbar     = document.getElementById('navbar');

    if (openMenu) {
        openMenu.addEventListener('click', () => {
            mobileMenu?.classList.remove('-translate-x-full');
            document.body.classList.add('overflow-hidden');
            navbar?.classList.remove('backdrop-blur');
        });
    }
    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            mobileMenu?.classList.add('-translate-x-full');
            document.body.classList.remove('overflow-hidden');
            navbar?.classList.add('backdrop-blur');
        });
    }
    mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('-translate-x-full');
            document.body.classList.remove('overflow-hidden');
            navbar?.classList.add('backdrop-blur');
        });
    });

    // Mobile profile menu
    const mobileProfileBtn       = document.getElementById('mobileProfileBtn');
    const closeMobileProfileMenu = document.getElementById('closeMobileProfileMenu');
    const mobileProfileMenu      = document.getElementById('mobileProfileMenu');

    if (mobileProfileBtn) {
        mobileProfileBtn.addEventListener('click', () => {
            if (mobileProfileMenu) { mobileProfileMenu.style.display = 'flex'; }
            document.body.classList.add('overflow-hidden');
        });
    }
    if (closeMobileProfileMenu) {
        closeMobileProfileMenu.addEventListener('click', () => {
            if (mobileProfileMenu) { mobileProfileMenu.style.display = 'none'; }
            document.body.classList.remove('overflow-hidden');
        });
    }

    // Theme toggle
    const themeToggle  = document.getElementById('themeToggle');
    const logo         = document.getElementById('logo');
    const landingText  = document.getElementById('landing-text');
    const logoFooter   = document.getElementById('logo-footer');
    const logoUrl      = 'https://www.nexoraglobal.info/_next/image?url=%2Fimages%2Flogo.png&w=640&q=75';
    const landingLight = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 930 340'%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='120' fill='%238b5cf6' opacity='0.13'%3ENEXORA%3C/text%3E%3C/svg%3E";
    const landingDark  = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 930 340'%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='120' fill='%23c4b5fd' opacity='0.14'%3ENEXORA%3C/text%3E%3C/svg%3E";
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`;
    const sunIcon  = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            if (logo)        logo.src = logoUrl;
            if (logoFooter)  logoFooter.src = logoUrl;
            themeToggle.innerHTML = isDark ? moonIcon : sunIcon;
            if (landingText) landingText.src = isDark ? landingDark : landingLight;
        });
    }

    // Get Started button
    const getStartedBtn = document.querySelector('.bg-purple-600.h-11');
    if (getStartedBtn?.textContent.includes('Get started')) {
        getStartedBtn.addEventListener('click', e => { e.preventDefault(); openAuthModal(); });
    }

    console.log('✅ Nexora initialized');
});