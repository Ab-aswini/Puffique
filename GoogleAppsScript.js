/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  PUFFIQUE — Google Apps Script Backend (Full CMS)           ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * SETUP:
 * 1. Open https://sheets.new
 * 2. Extensions → Apps Script → paste this → Run "setupSheets"
 * 3. Deploy → New Deployment → Web App (Execute as Me, Anyone)
 * 4. Copy URL → paste into src/utils/api.js line 4
 */

const WHATSAPP_API_TOKEN = 'YOUR_WHATSAPP_API_TOKEN';
const WHATSAPP_PHONE_ID  = 'YOUR_WHATSAPP_PHONE_ID';

// ==============================
// AUTO-SETUP
// ==============================
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🧈 PUFFIQUE').addItem('Setup Sheets', 'setupSheets').addToUi();
}

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const goldBg = '#c8a96e', darkText = '#1a1a1a';

  // ---- Products ----
  _createSheet(ss, 'Products', ['ID','Name','Price','Type','IsOutOfStock','Description','Image'], [
    [1,'The Signature Bun Maska',40,'Bun Maska','FALSE','Cloud-soft, double-buttered, toasted to a golden crisp.','/products/bun-maska.png'],
    [2,'Velvet Chai',20,'Chai','FALSE','A proprietary blend of Assam tea and secret spices.','/products/download-2.png'],
    [3,'NYC Cheesecake',150,'Cheesecake','FALSE','Thick, creamy, and layered with premium berry coulis.','/products/cheese cake.png'],
    [4,'Iced Mocha',60,'Chai','FALSE','Chilled artisanal coffee with mocha drizzle.','/products/mocha drink..png'],
  ], goldBg, darkText);

  // ---- Leads ----
  _createSheet(ss, 'Leads', ['Timestamp','ID','Name','Phone','Outlet','Message','Status'], [
    [new Date().toISOString(),'1001','Priya Sharma','+91 9876543210','Infocity','Want to book for a team lunch — 25 people.','New'],
  ], goldBg, darkText);

  // ---- Locations ----
  _createSheet(ss, 'Locations', ['ID','Name','Description','Hours','MapsLink'], [
    ['infocity','Infocity — Plaza Mall','The corporate fuel station. Quick bites between meetings.','7 AM – 11 PM','https://maps.google.com/?q=Infocity+Bhubaneswar'],
    ['sum','SUM — SOA Campus 2','The midnight comfort zone. Open late for students and night-owls.','8 AM – 1 AM','https://maps.google.com/?q=SUM+Hospital+Bhubaneswar'],
    ['ram-mandir','Ram Mandir','The weekend classic. Family-friendly vibes with our full dessert menu.','8 AM – 10 PM','https://maps.google.com/?q=Ram+Mandir+Bhubaneswar'],
  ], goldBg, darkText);

  // ---- Settings (key-value pairs) ----
  _createSheet(ss, 'Settings', ['Key','Value'], [
    ['hero_title','BITE. SIP. BLISS.'],
    ['hero_subtitle','A modern tribute to the golden ratio of butter and brew. Experience Bhubaneswar\'s most iconic duo — crafted with precision, served with soul.'],
    ['vision_title','The PUFFIQUE Vision'],
    ['vision_text','Born in the heart of Odisha, PUFFIQUE bridges traditional bakery soul with modern QSR speed. Three outlets. One obsession — to engineer the perfect puff and brew the perfect cup.'],
    ['about_title','Our Story'],
    ['about_subtitle','Born in the heart of Odisha, PUFFIQUE bridges traditional bakery soul with modern QSR speed.'],
    ['about_card1_title','The Dough'],
    ['about_card1_desc','Our signature buns undergo a strict 14-hour fermentation process. Cloud-soft on the inside, golden and crisp on the outside — this is the art of engineering the perfect puff.'],
    ['about_card2_title','The Brew'],
    ['about_card2_desc','A proprietary blend of Assam tea with secret spices, served in our signature charcoal cups. Whether it\'s a cutting chai or a full mug, every sip tells a story.'],
    ['about_card3_title','The Vision'],
    ['about_card3_desc','From a single dream to the pulse of Bhubaneswar\'s food scene. Three outlets — Infocity, SUM Hospital, and Ram Mandir — redefining the bakery experience across the city.'],
    ['contact_title','Get in Touch'],
    ['contact_subtitle','Want to partner, host an event, or share feedback? We\'d love to hear from you.'],
    ['announcement',''],
  ], goldBg, darkText);

  // Remove default Sheet1
  try { const d = ss.getSheetByName('Sheet1'); if (d && d.getLastRow() <= 1) ss.deleteSheet(d); } catch(e) {}

  SpreadsheetApp.getUi().alert('✅ Setup Complete! Products, Leads, Locations, and Settings sheets are ready.\n\nDeploy → New Deployment → Web App.');
}

function _createSheet(ss, name, headers, data, bg, fg) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name); else sheet.clear();
  sheet.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold').setBackground(bg).setFontColor(fg);
  if (data.length) sheet.getRange(2,1,data.length,headers.length).setValues(data);
  for (let i=1; i<=headers.length; i++) sheet.autoResizeColumn(i);
}

// ==============================
// POST HANDLER
// ==============================
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let data;
  try { data = JSON.parse(e.postData.contents); } catch(err) { return _json({success:false,error:'Invalid JSON'}); }

  // --- Submit Lead ---
  if (data.action === 'submitLead') {
    const sheet = ss.getSheetByName('Leads');
    const id = Date.now().toString();
    sheet.appendRow([new Date().toISOString(), id, data.name||'', data.phone||'', data.outlet||'', data.message||'', 'New']);
    sendWhatsAppNotification(data.phone, data.name, data.outlet);
    return _json({success:true, id});
  }

  // --- Add Product ---
  if (data.action === 'addProduct') {
    const sheet = ss.getSheetByName('Products');
    const id = Date.now();
    sheet.appendRow([id, data.name||'', data.price||0, data.type||'', data.isOutOfStock?'TRUE':'FALSE', data.desc||'', data.image||'']);
    return _json({success:true, id});
  }

  // --- Edit Product ---
  if (data.action === 'editProduct') {
    const sheet = ss.getSheetByName('Products');
    const vals = sheet.getDataRange().getValues();
    for (let i=1; i<vals.length; i++) {
      if (String(vals[i][0]) === String(data.id)) {
        if (data.name !== undefined) sheet.getRange(i+1,2).setValue(data.name);
        if (data.price !== undefined) sheet.getRange(i+1,3).setValue(data.price);
        if (data.type !== undefined) sheet.getRange(i+1,4).setValue(data.type);
        if (data.isOutOfStock !== undefined) sheet.getRange(i+1,5).setValue(data.isOutOfStock?'TRUE':'FALSE');
        if (data.desc !== undefined) sheet.getRange(i+1,6).setValue(data.desc);
        if (data.image !== undefined) sheet.getRange(i+1,7).setValue(data.image);
        return _json({success:true});
      }
    }
    return _json({success:false, error:'Product not found'});
  }

  // --- Delete Product ---
  if (data.action === 'deleteProduct') {
    const sheet = ss.getSheetByName('Products');
    const vals = sheet.getDataRange().getValues();
    for (let i=1; i<vals.length; i++) {
      if (String(vals[i][0]) === String(data.id)) {
        sheet.deleteRow(i+1);
        return _json({success:true});
      }
    }
    return _json({success:false, error:'Product not found'});
  }

  // --- Update Product Stock ---
  if (data.action === 'updateProduct') {
    const sheet = ss.getSheetByName('Products');
    const vals = sheet.getDataRange().getValues();
    for (let i=1; i<vals.length; i++) {
      if (String(vals[i][0]) === String(data.id)) {
        sheet.getRange(i+1,5).setValue(data.isOutOfStock?'TRUE':'FALSE');
        return _json({success:true});
      }
    }
    return _json({success:false, error:'Product not found'});
  }

  // --- Update Lead Status ---
  if (data.action === 'updateLeadStatus') {
    const sheet = ss.getSheetByName('Leads');
    const vals = sheet.getDataRange().getValues();
    for (let i=1; i<vals.length; i++) {
      if (String(vals[i][1]) === String(data.id)) {
        sheet.getRange(i+1,7).setValue(data.status);
        return _json({success:true});
      }
    }
    return _json({success:false, error:'Lead not found'});
  }

  // --- Update Location ---
  if (data.action === 'updateLocation') {
    const sheet = ss.getSheetByName('Locations');
    const vals = sheet.getDataRange().getValues();
    for (let i=1; i<vals.length; i++) {
      if (String(vals[i][0]) === String(data.id)) {
        if (data.name !== undefined) sheet.getRange(i+1,2).setValue(data.name);
        if (data.desc !== undefined) sheet.getRange(i+1,3).setValue(data.desc);
        if (data.hours !== undefined) sheet.getRange(i+1,4).setValue(data.hours);
        if (data.link !== undefined) sheet.getRange(i+1,5).setValue(data.link);
        return _json({success:true});
      }
    }
    return _json({success:false, error:'Location not found'});
  }

  // --- Update Setting ---
  if (data.action === 'updateSetting') {
    const sheet = ss.getSheetByName('Settings');
    const vals = sheet.getDataRange().getValues();
    for (let i=1; i<vals.length; i++) {
      if (vals[i][0] === data.key) {
        sheet.getRange(i+1,2).setValue(data.value);
        return _json({success:true});
      }
    }
    // Key not found, add it
    sheet.appendRow([data.key, data.value]);
    return _json({success:true});
  }

  return _json({success:false, error:'Unknown action: '+data.action});
}

// ==============================
// GET HANDLER
// ==============================
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const action = e.parameter.action;

  if (action === 'getProducts') return _json(_sheetToJson(ss,'Products'));
  if (action === 'getLeads') {
    const leads = _sheetToJson(ss,'Leads');
    leads.sort((a,b) => new Date(b.Timestamp) - new Date(a.Timestamp));
    return _json(leads);
  }
  if (action === 'getLocations') return _json(_sheetToJson(ss,'Locations'));
  if (action === 'getSettings') {
    const rows = _sheetToJson(ss,'Settings');
    const obj = {};
    rows.forEach(r => { obj[r.Key] = r.Value; });
    return _json(obj);
  }

  return _json({error:'Provide ?action=getProducts|getLeads|getLocations|getSettings'});
}

// ==============================
// HELPERS
// ==============================
function _sheetToJson(ss, name) {
  const sheet = ss.getSheetByName(name);
  if (!sheet) return [];
  const vals = sheet.getDataRange().getValues();
  if (vals.length <= 1) return [];
  const headers = vals[0], result = [];
  for (let i=1; i<vals.length; i++) {
    const obj = {};
    for (let j=0; j<headers.length; j++) obj[headers[j]] = vals[i][j];
    result.push(obj);
  }
  return result;
}

function _json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

// ==============================
// WHATSAPP (optional)
// ==============================
function sendWhatsAppNotification(phone, name, outlet) {
  if (!phone || WHATSAPP_API_TOKEN === 'YOUR_WHATSAPP_API_TOKEN') return;
  let f = phone.replace(/\D/g,''); if (f.length===10) f='91'+f;
  try {
    UrlFetchApp.fetch('https://graph.facebook.com/v17.0/'+WHATSAPP_PHONE_ID+'/messages', {
      method:'post', headers:{'Authorization':'Bearer '+WHATSAPP_API_TOKEN,'Content-Type':'application/json'},
      payload:JSON.stringify({messaging_product:'whatsapp',to:f,type:'template',template:{name:'puffique_lead_welcome',language:{code:'en_US'},components:[{type:'body',parameters:[{type:'text',text:name||'there'},{type:'text',text:outlet||'our store'}]}]}}),
      muteHttpExceptions:true
    });
  } catch(e) { Logger.log('WhatsApp Error: '+e); }
}
