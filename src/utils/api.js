// ============================================
// PUFFIQUE — Full CMS API Layer
// ============================================
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyTbHDn5vqDwjhbpm1-7GT1B12tDwTj8oD8lpPUvNuNrKrNvFP5HEuH-rgNUUpQj2yq/exec';
const IS_DEV = WEBHOOK_URL.startsWith('YOUR_');

// ---- Mock Data ----
const MOCK_PRODUCTS = [
  { ID:1, Name:'The Signature Bun Maska', Price:40, Type:'Bun Maska', IsOutOfStock:'FALSE', Description:'Cloud-soft, double-buttered, toasted to a golden crisp.', Image:'/products/bun-maska.png' },
  { ID:2, Name:'Velvet Chai', Price:20, Type:'Chai', IsOutOfStock:'FALSE', Description:'A proprietary blend of Assam tea and secret spices.', Image:'/products/download-2.png' },
  { ID:3, Name:'NYC Cheesecake', Price:150, Type:'Cheesecake', IsOutOfStock:'TRUE', Description:'Thick, creamy, and layered with premium berry coulis.', Image:'/products/cheese cake.png' },
  { ID:4, Name:'Iced Mocha', Price:60, Type:'Chai', IsOutOfStock:'FALSE', Description:'Chilled artisanal coffee with mocha drizzle.', Image:'/products/mocha drink..png' },
];

const MOCK_LEADS = [
  { ID:'1001', Timestamp:new Date().toISOString(), Name:'Priya Sharma', Phone:'+91 9876543210', Outlet:'Infocity', Message:'Want to book for a team lunch — 25 people.', Status:'New' },
  { ID:'1002', Timestamp:new Date(Date.now()-86400000).toISOString(), Name:'Rahul Patel', Phone:'+91 8765432109', Outlet:'SUM Hospital', Message:'Do you do midnight deliveries?', Status:'Contacted' },
];

const MOCK_LOCATIONS = [
  { ID:'infocity', Name:'Infocity — Plaza Mall', Description:'The corporate fuel station. Quick bites between meetings.', Hours:'7 AM – 11 PM', MapsLink:'https://maps.google.com/?q=Infocity+Bhubaneswar' },
  { ID:'sum', Name:'SUM — SOA Campus 2', Description:'The midnight comfort zone. Open late for students and night-owls.', Hours:'8 AM – 1 AM', MapsLink:'https://maps.google.com/?q=SUM+Hospital+Bhubaneswar' },
  { ID:'ram-mandir', Name:'Ram Mandir', Description:'The weekend classic. Family-friendly vibes with our full dessert menu.', Hours:'8 AM – 10 PM', MapsLink:'https://maps.google.com/?q=Ram+Mandir+Bhubaneswar' },
];

const MOCK_SETTINGS = {
  hero_title: 'BITE. SIP. BLISS.',
  hero_subtitle: "A modern tribute to the golden ratio of butter and brew. Experience Bhubaneswar's most iconic duo — crafted with precision, served with soul.",
  vision_title: 'The PUFFIQUE Vision',
  vision_text: 'Born in the heart of Odisha, PUFFIQUE bridges traditional bakery soul with modern QSR speed. Three outlets. One obsession — to engineer the perfect puff and brew the perfect cup.',
  about_title: 'Our Story',
  about_subtitle: 'Born in the heart of Odisha, PUFFIQUE bridges traditional bakery soul with modern QSR speed.',
  about_card1_title: 'The Dough',
  about_card1_desc: 'Our signature buns undergo a strict 14-hour fermentation process. Cloud-soft on the inside, golden and crisp on the outside — this is the art of engineering the perfect puff.',
  about_card2_title: 'The Brew',
  about_card2_desc: "A proprietary blend of Assam tea with secret spices, served in our signature charcoal cups. Whether it's a cutting chai or a full mug, every sip tells a story.",
  about_card3_title: 'The Vision',
  about_card3_desc: "From a single dream to the pulse of Bhubaneswar's food scene. Three outlets — Infocity, SUM Hospital, and Ram Mandir — redefining the bakery experience across the city.",
  contact_title: 'Get in Touch',
  contact_subtitle: "Want to partner, host an event, or share feedback? We'd love to hear from you.",
  announcement: '',
};

// ---- Normalizers ----
function normalizeProduct(p) {
  return { id: p.ID||p.id, name: p.Name||p.name, price: p.Price||p.price, type: p.Type||p.type, isOutOfStock: p.IsOutOfStock==='TRUE'||p.IsOutOfStock===true||p.isOutOfStock===true, desc: p.Description||p.desc||'', image: p.Image||p.image||'' };
}
function normalizeLead(l) {
  return { id: l.ID||l.id, timestamp: l.Timestamp||l.timestamp, name: l.Name||l.name, phone: l.Phone||l.phone, outlet: l.Outlet||l.outlet, message: l.Message||l.message, status: l.Status||l.status||'New' };
}
function normalizeLocation(l) {
  return { id: l.ID||l.id, name: l.Name||l.name, desc: l.Description||l.desc, hours: l.Hours||l.hours, link: l.MapsLink||l.link };
}

// ---- Helpers ----
async function _post(action, data) {
  if (IS_DEV) { console.log('[DEV]', action, data); return { success: true }; }
  try {
    await fetch(WEBHOOK_URL, { method:'POST', body:JSON.stringify({action,...data}), headers:{'Content-Type':'text/plain'} });
    return { success: true };
  } catch (error) { console.error('API Error:', error); return { success:false, error }; }
}

async function _get(action) {
  const r = await fetch(`${WEBHOOK_URL}?action=${action}`);
  if (!r.ok) throw new Error('Network error');
  return r.json();
}

// ============================================
// READS
// ============================================
export async function fetchProducts() {
  if (IS_DEV) return MOCK_PRODUCTS.map(normalizeProduct);
  try { return (await _get('getProducts')).map(normalizeProduct); } catch(e) { console.error(e); return []; }
}

export async function fetchLeads() {
  if (IS_DEV) return MOCK_LEADS.map(normalizeLead);
  try { return (await _get('getLeads')).map(normalizeLead); } catch(e) { console.error(e); return []; }
}

export async function fetchLocations() {
  if (IS_DEV) return MOCK_LOCATIONS.map(normalizeLocation);
  try { return (await _get('getLocations')).map(normalizeLocation); } catch(e) { console.error(e); return []; }
}

export async function fetchSettings() {
  if (IS_DEV) return { ...MOCK_SETTINGS };
  try { return await _get('getSettings'); } catch(e) { console.error(e); return { ...MOCK_SETTINGS }; }
}

// ============================================
// WRITES
// ============================================
export async function submitLead(data) { return _post('submitLead', data); }
export async function toggleProductStatus(id, newStatus) { return _post('updateProduct', { id, isOutOfStock: newStatus }); }
export async function updateLeadStatus(id, newStatus) { return _post('updateLeadStatus', { id, status: newStatus }); }

// Product CRUD
export async function addProduct(data) { return _post('addProduct', data); }
export async function editProduct(data) { return _post('editProduct', data); }
export async function deleteProduct(id) { return _post('deleteProduct', { id }); }

// Locations
export async function updateLocation(data) { return _post('updateLocation', data); }

// Settings
export async function updateSetting(key, value) { return _post('updateSetting', { key, value }); }
