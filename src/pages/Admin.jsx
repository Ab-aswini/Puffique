import { useState } from 'react';
import { fetchProducts, fetchLeads, fetchLocations, fetchSettings, toggleProductStatus, updateLeadStatus, addProduct, editProduct, deleteProduct, updateLocation, updateSetting } from '../utils/api';
import { MessageSquare, Plus, Pencil, Trash2, Save, X, RefreshCw, Check } from 'lucide-react';

const ADMIN_PIN = '1234';

export default function Admin() {
  const [isAuth, setIsAuth] = useState(false);
  const [pin, setPin] = useState('');
  const [products, setProducts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [locations, setLocations] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');

  // Product form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [productForm, setProductForm] = useState({ name:'', price:'', type:'Bun Maska', desc:'', image:'' });
  const [publishMsg, setPublishMsg] = useState('');

  // Location edit state
  const [editingLocId, setEditingLocId] = useState(null);
  const [locForm, setLocForm] = useState({});

  // Content edit state
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleLogin = (e) => { e.preventDefault(); if (pin === ADMIN_PIN) { setIsAuth(true); loadData(); } else alert('Incorrect PIN'); };

  const loadData = async () => {
    setLoading(true);
    const [p, l, loc, s] = await Promise.all([fetchProducts(), fetchLeads(), fetchLocations(), fetchSettings()]);
    setProducts(p); setLeads(l); setLocations(loc); setSettings(s);
    setLoading(false);
  };

  // ---- Product CRUD ----
  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.price) return alert('Name and Price are required');
    await addProduct({ name: productForm.name, price: Number(productForm.price), type: productForm.type, desc: productForm.desc, image: productForm.image });
    setShowAddForm(false); setProductForm({ name:'', price:'', type:'Bun Maska', desc:'', image:'' }); loadData();
  };

  const handleEditProduct = async (id) => {
    await editProduct({ id, name: productForm.name, price: Number(productForm.price), type: productForm.type, desc: productForm.desc, image: productForm.image });
    setEditingId(null); setProductForm({ name:'', price:'', type:'Bun Maska', desc:'', image:'' }); loadData();
  };

  const handleDeleteProduct = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await deleteProduct(id); loadData();
  };

  const startEdit = (item) => { setEditingId(item.id); setProductForm({ name: item.name, price: item.price, type: item.type, desc: item.desc, image: item.image || '' }); };

  // ---- Publish / Sync ----
  const handlePublish = async () => {
    setPublishMsg('Syncing...');
    await loadData();
    setPublishMsg('✅ Website updated!');
    setTimeout(() => setPublishMsg(''), 3000);
  };

  // ---- Location ----
  const startLocEdit = (loc) => { setEditingLocId(loc.id); setLocForm({ name: loc.name, desc: loc.desc, hours: loc.hours, link: loc.link }); };
  const handleSaveLocation = async (id) => { await updateLocation({ id, ...locForm }); setEditingLocId(null); loadData(); };

  // ---- Settings ----
  const startSettingEdit = (key) => { setEditingKey(key); setEditValue(settings[key] || ''); };
  const handleSaveSetting = async (key) => {
    await updateSetting(key, editValue);
    setSettings({ ...settings, [key]: editValue }); setEditingKey(null);
  };

  // ---- Lead ----
  const handleToggleStock = async (id, cur) => { setProducts(products.map(p => p.id===id ? { ...p, isOutOfStock:!cur } : p)); await toggleProductStatus(id, !cur); };
  const handleLeadStatus = async (id, cur) => {
    const next = cur==='New'?'Contacted':cur==='Contacted'?'Closed':'New';
    setLeads(leads.map(l => l.id===id ? { ...l, status:next } : l)); await updateLeadStatus(id, next);
  };

  const totalProducts = products.length, inStock = products.filter(p=>!p.isOutOfStock).length, totalLeads = leads.length, newLeads = leads.filter(l=>l.status==='New').length;

  const tabs = [
    { key:'inventory', label:'Inventory' },
    { key:'leads', label:'Leads' },
    { key:'stores', label:'Stores' },
    { key:'content', label:'Content' },
  ];

  const contentFields = [
    { key:'hero_title', label:'Hero Title' },
    { key:'hero_subtitle', label:'Hero Subtitle' },
    { key:'vision_title', label:'Vision Title' },
    { key:'vision_text', label:'Vision Text' },
    { key:'about_title', label:'About Page Title' },
    { key:'about_subtitle', label:'About Page Subtitle' },
    { key:'about_card1_title', label:'Story Card 1 — Title' },
    { key:'about_card1_desc', label:'Story Card 1 — Description' },
    { key:'about_card2_title', label:'Story Card 2 — Title' },
    { key:'about_card2_desc', label:'Story Card 2 — Description' },
    { key:'about_card3_title', label:'Story Card 3 — Title' },
    { key:'about_card3_desc', label:'Story Card 3 — Description' },
    { key:'contact_title', label:'Contact Page Title' },
    { key:'contact_subtitle', label:'Contact Page Subtitle' },
    { key:'announcement', label:'Announcement Banner (empty = hidden)' },
  ];

  // ==========================================
  // LOGIN
  // ==========================================
  if (!isAuth) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
        <form onSubmit={handleLogin} className="card" style={{ padding:'40px', width:'100%', maxWidth:'380px', textAlign:'center' }}>
          <h2 style={{ color:'var(--color-gold)', fontSize:'1.6rem', marginBottom:'8px' }}>Admin Login</h2>
          <p style={{ color:'var(--color-text-secondary)', fontSize:'0.9rem', marginBottom:'24px' }}>PUFFIQUE Command Center</p>
          <input type="password" placeholder="Enter PIN" value={pin} onChange={e=>setPin(e.target.value)} className="form-input" style={{ textAlign:'center', letterSpacing:'0.3em', fontSize:'1.2rem', marginBottom:'16px', width:'100%' }} />
          <button type="submit" className="btn btn-primary" style={{ width:'100%' }}>Access Dashboard</button>
        </form>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================
  return (
    <div style={{ padding:'clamp(16px,3vw,40px)', paddingTop:'90px', maxWidth:'1200px', margin:'0 auto' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px', marginBottom:'32px' }}>
        <div>
          <h1 style={{ color:'var(--color-gold)', fontSize:'clamp(1.5rem,3vw,2rem)', margin:0 }}>Command Center</h1>
          <p style={{ color:'var(--color-text-secondary)', margin:0, fontSize:'0.9rem' }}>Full Website Control</p>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {publishMsg && <span style={{ color:'#4ade80', fontSize:'0.85rem', fontWeight:600, marginRight:'8px' }}>{publishMsg}</span>}
          <button className="btn btn-primary" onClick={handlePublish} style={{ padding:'8px 20px', fontSize:'0.85rem', display:'flex', alignItems:'center', gap:'6px' }}><RefreshCw size={15}/> Update Website</button>
          <button className="btn btn-outline" onClick={()=>setIsAuth(false)} style={{ padding:'8px 16px', fontSize:'0.8rem' }}>Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:'12px', marginBottom:'32px' }}>
        {[
          { label:'Products', value:totalProducts, color:'var(--color-gold)' },
          { label:'In Stock', value:inStock, color:'#4ade80' },
          { label:'Total Leads', value:totalLeads, color:'var(--color-gold)' },
          { label:'New Leads', value:newLeads, color:'#38bdf8' },
        ].map(s=>(
          <div key={s.label} className="card" style={{ padding:'20px', textAlign:'center' }}>
            <div style={{ fontSize:'2rem', fontWeight:'700', color:s.color }}>{s.value}</div>
            <div style={{ fontSize:'0.8rem', color:'var(--color-text-secondary)', marginTop:'4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:0, marginBottom:'24px', borderBottom:'1px solid var(--color-border)', overflowX:'auto' }}>
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setActiveTab(t.key)} style={{ padding:'12px 20px', fontSize:'0.85rem', fontWeight:600, color:activeTab===t.key?'var(--color-gold)':'var(--color-text-secondary)', borderBottom:activeTab===t.key?'2px solid var(--color-gold)':'2px solid transparent', textTransform:'uppercase', letterSpacing:'0.04em', whiteSpace:'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <p style={{ color:'var(--color-gold)', padding:'20px' }}>Loading...</p> : (
        <>
          {/* ====== INVENTORY ====== */}
          {activeTab === 'inventory' && (
            <div>
              <div style={{ marginBottom:'16px', display:'flex', justifyContent:'flex-end' }}>
                <button className="btn btn-primary" onClick={()=>{ setShowAddForm(true); setEditingId(null); setProductForm({name:'',price:'',type:'Bun Maska',desc:'',image:''}); }} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 20px', fontSize:'0.85rem' }}>
                  <Plus size={16} /> Add Product
                </button>
              </div>

              {/* Add/Edit Form */}
              {(showAddForm || editingId) && (
                <div className="card" style={{ padding:'24px', marginBottom:'16px' }}>
                  <h3 style={{ color:'var(--color-gold)', marginBottom:'16px' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                    <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={productForm.name} onChange={e=>setProductForm({...productForm,name:e.target.value})} placeholder="Product name" /></div>
                    <div className="form-group"><label className="form-label">Price (₹)</label><input className="form-input" type="number" value={productForm.price} onChange={e=>setProductForm({...productForm,price:e.target.value})} placeholder="40" /></div>
                    <div className="form-group"><label className="form-label">Type</label>
                      <select className="form-input" value={productForm.type} onChange={e=>setProductForm({...productForm,type:e.target.value})}>
                        <option>Bun Maska</option><option>Chai</option><option>Cheesecake</option><option>Other</option>
                      </select>
                    </div>
                    <div className="form-group"><label className="form-label">Description</label><input className="form-input" value={productForm.desc} onChange={e=>setProductForm({...productForm,desc:e.target.value})} placeholder="Short description" /></div>
                    <div className="form-group" style={{ gridColumn:'1 / -1' }}><label className="form-label">Image URL</label><input className="form-input" value={productForm.image} onChange={e=>setProductForm({...productForm,image:e.target.value})} placeholder="/products/my-image.png or https://..." /><small style={{ color:'var(--color-text-secondary)', fontSize:'0.75rem' }}>Path to product image. Use /products/filename.png for local images.</small></div>
                  </div>
                  <div style={{ display:'flex', gap:'8px', marginTop:'16px' }}>
                    <button className="btn btn-primary" onClick={()=>editingId ? handleEditProduct(editingId) : handleAddProduct()} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 20px', fontSize:'0.85rem' }}>
                      <Save size={16} /> {editingId ? 'Save Changes' : 'Add Product'}
                    </button>
                    <button className="btn btn-outline" onClick={()=>{setShowAddForm(false);setEditingId(null);}} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 20px', fontSize:'0.85rem' }}>
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="card" style={{ overflow:'hidden' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr style={{ borderBottom:'1px solid var(--color-border)' }}>
                    <th style={th}>Product</th><th style={th}>Type</th><th style={th}>Price</th><th style={th}>Status</th><th style={th}>Actions</th>
                  </tr></thead>
                  <tbody>
                    {products.map(item=>(
                      <tr key={item.id} style={{ borderBottom:'1px solid var(--color-border)' }}>
                        <td style={td}><strong>{item.name}</strong><br/><span style={{ fontSize:'0.8rem', color:'var(--color-text-secondary)' }}>{item.desc}</span></td>
                        <td style={td}>{item.type}</td>
                        <td style={td}>₹{item.price}</td>
                        <td style={td}><span className={item.isOutOfStock?'tag tag-oos':'tag tag-available'}>{item.isOutOfStock?'Out of Stock':'In Stock'}</span></td>
                        <td style={td}>
                          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                            <button className="btn btn-outline" style={actBtn} onClick={()=>handleToggleStock(item.id,item.isOutOfStock)}>Toggle</button>
                            <button className="btn btn-outline" style={actBtn} onClick={()=>startEdit(item)}><Pencil size={13}/></button>
                            <button className="btn btn-outline" style={{...actBtn, color:'#ff6b6b', borderColor:'#ff6b6b'}} onClick={()=>handleDeleteProduct(item.id,item.name)}><Trash2 size={13}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====== LEADS ====== */}
          {activeTab === 'leads' && (
            <div className="card" style={{ overflow:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'650px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--color-border)' }}>
                  <th style={th}>Customer</th><th style={th}>Outlet</th><th style={th}>Message</th><th style={th}>Status</th><th style={th}>Actions</th>
                </tr></thead>
                <tbody>
                  {leads.map(lead=>(
                    <tr key={lead.id} style={{ borderBottom:'1px solid var(--color-border)' }}>
                      <td style={td}><strong>{lead.name}</strong><br/><span style={{ fontSize:'0.8rem', color:'var(--color-text-secondary)' }}>{lead.phone}</span></td>
                      <td style={td}>{lead.outlet}</td>
                      <td style={{...td, maxWidth:'250px', fontSize:'0.85rem', color:'var(--color-text-secondary)' }}>{lead.message}</td>
                      <td style={td}>
                        <button onClick={()=>handleLeadStatus(lead.id,lead.status)} className="tag" style={{ cursor:'pointer', background:lead.status==='New'?'rgba(74,222,128,0.15)':lead.status==='Contacted'?'rgba(56,189,248,0.15)':'rgba(255,255,255,0.1)', color:lead.status==='New'?'#4ade80':lead.status==='Contacted'?'#38bdf8':'#a0a0a0', border:'none' }}>
                          {lead.status}
                        </button>
                      </td>
                      <td style={td}>
                        <a href={`https://wa.me/${(lead.phone||'').replace(/\D/g,'')}?text=Hello ${lead.name}! Thanks for reaching out to PUFFIQUE. 🧈`} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding:'6px 12px', fontSize:'0.75rem', display:'inline-flex', alignItems:'center', gap:'4px' }}>
                          <MessageSquare size={14}/> WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                  {leads.length===0 && <tr><td colSpan="5" style={{...td, textAlign:'center', color:'var(--color-text-secondary)'}}>No leads yet.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* ====== STORES ====== */}
          {activeTab === 'stores' && (
            <div className="grid-3">
              {locations.map(loc=>(
                <div className="card" key={loc.id} style={{ padding:'24px' }}>
                  {editingLocId === loc.id ? (
                    <>
                      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                        <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={locForm.name} onChange={e=>setLocForm({...locForm,name:e.target.value})} /></div>
                        <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows="3" value={locForm.desc} onChange={e=>setLocForm({...locForm,desc:e.target.value})} /></div>
                        <div className="form-group"><label className="form-label">Hours</label><input className="form-input" value={locForm.hours} onChange={e=>setLocForm({...locForm,hours:e.target.value})} /></div>
                        <div className="form-group"><label className="form-label">Maps Link</label><input className="form-input" value={locForm.link} onChange={e=>setLocForm({...locForm,link:e.target.value})} /></div>
                      </div>
                      <div style={{ display:'flex', gap:'8px', marginTop:'16px' }}>
                        <button className="btn btn-primary" onClick={()=>handleSaveLocation(loc.id)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', fontSize:'0.85rem' }}><Save size={14}/> Save</button>
                        <button className="btn btn-outline" onClick={()=>setEditingLocId(null)} style={{ padding:'8px 16px', fontSize:'0.85rem' }}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 style={{ color:'var(--color-gold)', marginBottom:'8px' }}>{loc.name}</h3>
                      <p style={{ color:'var(--color-text-secondary)', lineHeight:1.7, marginBottom:'8px' }}>{loc.desc}</p>
                      <p style={{ color:'var(--color-text-secondary)', fontSize:'0.85rem', marginBottom:'16px' }}>🕐 {loc.hours}</p>
                      <button className="btn btn-outline" onClick={()=>startLocEdit(loc)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', fontSize:'0.85rem' }}><Pencil size={14}/> Edit</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ====== CONTENT ====== */}
          {activeTab === 'content' && (
            <div className="card" style={{ overflow:'hidden' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--color-border)' }}>
                  <th style={{...th, width:'200px' }}>Field</th><th style={th}>Value</th><th style={{...th, width:'100px' }}>Action</th>
                </tr></thead>
                <tbody>
                  {contentFields.map(f=>(
                    <tr key={f.key} style={{ borderBottom:'1px solid var(--color-border)' }}>
                      <td style={{...td, fontWeight:600, fontSize:'0.85rem', color:'var(--color-gold)' }}>{f.label}</td>
                      <td style={td}>
                        {editingKey === f.key ? (
                          f.key.includes('desc') || f.key.includes('subtitle') || f.key.includes('text') ? (
                            <textarea className="form-input" rows="3" style={{ width:'100%' }} value={editValue} onChange={e=>setEditValue(e.target.value)} />
                          ) : (
                            <input className="form-input" style={{ width:'100%' }} value={editValue} onChange={e=>setEditValue(e.target.value)} />
                          )
                        ) : (
                          <span style={{ color:'var(--color-text-secondary)', fontSize:'0.9rem' }}>{settings[f.key] || '(empty)'}</span>
                        )}
                      </td>
                      <td style={td}>
                        {editingKey === f.key ? (
                          <div style={{ display:'flex', gap:'6px' }}>
                            <button className="btn btn-primary" onClick={()=>handleSaveSetting(f.key)} style={{ padding:'8px 16px', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:'4px' }}><Save size={14}/> Save</button>
                            <button className="btn btn-outline" onClick={()=>setEditingKey(null)} style={{ padding:'8px 16px', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:'4px' }}><X size={14}/> Cancel</button>
                          </div>
                        ) : (
                          <button className="btn btn-outline" onClick={()=>startSettingEdit(f.key)} style={{ padding:'8px 16px', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:'4px' }}><Pencil size={14}/> Edit</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const th = { padding:'14px 16px', textAlign:'left', fontSize:'0.8rem', color:'var(--color-text-secondary)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em' };
const td = { padding:'14px 16px', fontSize:'0.9rem' };
const actBtn = { padding:'6px 10px', fontSize:'0.75rem' };
