import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Search, 
  Edit3, 
  Save, 
  X,
  DollarSign,
  TrendingUp,
  Menu,
  History,
  ImageOff,
  Grid,
  List,
  Palette,
  ArrowRightLeft,
  Calendar,
  Store,
  User,
  Loader2,
  RefreshCw
} from 'lucide-react';

// ==========================================
// ★ 設定區：請將您的 Web App URL 貼在這裡
// ==========================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyXHfCFn4tL94SkkIVM6MDgFlYP1k7lfDUaMfy3utOdLo3_p6FbkaerbZxEppxbB8E/exec"; 
// 例如: "https://script.google.com/macros/s/AKfycbx.../exec"

const STREAMERS = ['工作室', 'Go時尚', '艾莉波波', '林千又', '陳卉', '愛包枕', '整染中'];
const BRANDS = ['CHANEL', 'HERMES', 'LV', 'GUCCI', 'CELINE', 'DIOR', 'BALENCIAGA', 'LOEWE'];

const BG_COLORS = {
  white: 'bg-white',
  gray: 'bg-slate-300', 
  red: 'bg-red-100',
  orange: 'bg-orange-100',
  yellow: 'bg-yellow-100',
  green: 'bg-emerald-100',
  blue: 'bg-blue-100',
  purple: 'bg-purple-100',
  pink: 'bg-pink-100',
  rose: 'bg-rose-100'
};

const formatCurrency = (val) => {
  if (!val && val !== 0) return '-';
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(val);
};

// --- Modal 元件 ---

const StreamerSwitchModal = ({ item, onClose, onSave }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold">分配商品持有者</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="p-4">
          <p className="text-sm text-slate-500 mb-3">商品序號: <span className="font-mono font-bold text-slate-800">{item.id}</span></p>
          <div className="grid grid-cols-2 gap-2">
            {STREAMERS.map(s => (
              <button
                key={s}
                onClick={() => onSave(item.id, s)}
                className={`p-3 rounded-lg text-sm font-bold border transition-all ${item.holder === s ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white hover:shadow-md'}`}
              >
                {s}
              </button>
            ))}
            <button
              onClick={() => onSave(item.id, '已售出')}
              className={`p-3 rounded-lg text-sm font-bold border transition-all col-span-2 ${item.status === '已售出' ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              標記為已售出
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState(item);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-slate-800">編輯資料: {item.id}</h2>
          <button onClick={onClose}><X size={24} className="text-slate-400" /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 border-b pb-1">基本資訊</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">商品名稱</label>
              <textarea name="type" value={formData.type} onChange={handleChange} rows={2} className="w-full p-2 border rounded-lg text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">品牌</label>
                <select name="brand" value={formData.brand} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm">
                   {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">配件</label>
                <input name="accessory" value={formData.accessory} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">同行價</label>
                <input type="number" name="peerPrice" value={formData.peerPrice} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">建議售價</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm font-bold text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 border-b pb-1">
              {item.status === '已售出' ? '銷售詳細資訊 (唯讀)' : '進貨詳細資訊 (唯讀)'}
            </h3>
            {item.status !== '已售出' ? (
              <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg">
                <div><label className="block text-xs font-medium text-slate-500 mb-1">買進價格</label><div className="text-sm font-medium">{formatCurrency(formData.buyPrice)}</div></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">買進時間</label><div className="text-sm font-medium">{formData.buyDate || '-'}</div></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">賣家平台</label><div className="text-sm font-medium">{formData.sellerPlatform || '-'}</div></div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg">
                <div><label className="block text-xs font-medium text-slate-500 mb-1">賣出價格</label><div className="text-sm font-medium">{formatCurrency(formData.sellPrice)}</div></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">賣出時間</label><div className="text-sm font-medium">{formData.sellDate || '-'}</div></div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">買家平台</label><div className="text-sm font-medium">{formData.buyerPlatform || '-'}</div></div>
              </div>
            )}
            <div className="text-xs text-slate-400">
               * 如需修改詳細進銷資訊，請至 Google Sheet 操作。
            </div>
          </div>
        </div>
        <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg">取消</button>
          <button onClick={() => onSave(formData)} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center">
            <Save size={16} className="mr-2" /> 儲存
          </button>
        </div>
      </div>
    </div>
  );
};

const ColorPickerModal = ({ item, onClose, onSave }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
    <div className="bg-white rounded-xl shadow-xl border p-4">
      <h3 className="text-sm font-bold text-slate-700 mb-3 text-center">標記卡片顏色</h3>
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(BG_COLORS).map(([name, cls]) => {
            if (name === 'gray' && item.status !== '已售出') return null; 
            return (
            <button 
              key={name}
              onClick={() => onSave(item.id, name)}
              className={`w-8 h-8 rounded-full border shadow-sm hover:scale-110 transition-transform ${cls} ${item.bgColor === name ? 'ring-2 ring-slate-800' : ''}`}
              title={name}
            />
          );
        })}
      </div>
      <button onClick={onClose} className="mt-4 w-full py-1 text-xs text-slate-500 hover:bg-slate-100 rounded">取消</button>
    </div>
  </div>
);

const ProductImage = ({ id, type, imageFileId }) => {
  const [error, setError] = useState(false);
  
  // 優先使用 Google Drive ID，沒有則使用 Unsplash
  let imageUrl = null;
  if (imageFileId) {
    imageUrl = `https://lh3.googleusercontent.com/d/${imageFileId}`;
  } else if (!error) {
    imageUrl = `https://source.unsplash.com/random/300x300/?handbag,luxury,${id}`;
  }

  if (error || !imageUrl) {
    return (
      <div className="w-full h-full bg-slate-200 flex flex-col items-center justify-center text-slate-400">
        <ImageOff size={24} className="mb-2 opacity-50" />
        <span className="text-[10px] font-medium">尚無照片</span>
      </div>
    );
  }
  return (
    <img src={imageUrl} alt={type} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={() => setError(true)} />
  );
};

// --- 主程式 ---

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [data, setData] = useState([]); // 初始為空，等待讀取
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [viewMode, setViewMode] = useState('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // 篩選
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('stock'); 
  const [filterStreamer, setFilterStreamer] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');

  // Modals
  const [editingItem, setEditingItem] = useState(null);
  const [colorPickingItem, setColorPickingItem] = useState(null);
  const [streamerSwitchItem, setStreamerSwitchItem] = useState(null);

  // 讀取資料
  const fetchData = async () => {
    if (!GOOGLE_SCRIPT_URL) {
      // 如果沒有 URL，使用模擬資料 (為了預覽方便)
      const MOCK_DATA = [
        { id: 'A1369', status: '在庫', holder: '工作室', price: 158000, peerPrice: 150000, type: 'Chanel 22bag (模擬)', brand: 'CHANEL', accessory: '全新', bgColor: 'white', buyPrice: 130000, buyDate: '2024-11-20' },
        { id: 'A1350', status: '已售出', holder: '已售出', price: 25000, peerPrice: 22000, type: 'Hermes短夾 (模擬)', brand: 'HERMES', accessory: '92新', bgColor: 'gray', sellPrice: 24000, sellDate: '2024-11-25' },
      ];
      setData(MOCK_DATA);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const json = await response.json();
      
      if (json.error) throw new Error(json.error);

      // 將 Google Sheet 的中文欄位映射到 React 的英文欄位
      const mappedData = json.map(row => {
        const holder = row['直播主'] || '工作室';
        const isSold = holder === '已售出';
        
        return {
          id: row['序號'],
          status: isSold ? '已售出' : '在庫',
          holder: holder,
          price: row['建議售價'],
          peerPrice: row['同行價'],
          cost: row['成本'] || row['買進價格'], 
          type: row['包包類型'],
          brand: row['品牌'],
          accessory: row['配件'],
          bgColor: 'white', // 預設白色，可之後新增 Sheet 欄位來存
          
          // 進貨資訊
          buyPrice: row['買進價格'],
          buyDate: row['買進時間'] ? new Date(row['買進時間']).toLocaleDateString() : '',
          sellerPlatform: row['賣家平台'],
          
          // 銷貨資訊
          sellPrice: row['賣出價格'],
          sellDate: row['賣出時間'] ? new Date(row['賣出時間']).toLocaleDateString() : '',
          buyerPlatform: row['買家平台'],
          
          // 圖片 ID
          imageFileId: row['imageFileId']
        };
      });
      
      setData(mappedData);
    } catch (err) {
      console.error(err);
      setError("無法讀取資料，請檢查網址或權限。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 更新資料 (寫回 Google Sheet)
  const updateData = async (payload) => {
    if (!GOOGLE_SCRIPT_URL) return;
    
    // 樂觀更新前端
    if (payload.action === 'updateHolder') {
      setData(prev => prev.map(item => {
         if (item.id === payload.id) {
           const isSold = payload.holder === '已售出';
           return {
             ...item,
             holder: payload.holder,
             status: isSold ? '已售出' : '在庫',
             bgColor: isSold ? 'gray' : (item.bgColor === 'gray' ? 'white' : item.bgColor)
           };
         }
         return item;
      }));
    }

    // 發送 POST 請求
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("更新失敗", err);
      alert("更新失敗，請檢查網路");
    }
  };

  // Dashboard Stats
  const stats = useMemo(() => {
    const inStockItems = data.filter(i => i.status !== '已售出');
    const totalCost = inStockItems.reduce((acc, curr) => acc + Number(curr.cost || 0), 0);
    const monthlySold = data.filter(i => i.status === '已售出').length;
    return { stockCount: inStockItems.length, totalCost, monthlySold };
  }, [data]);

  // Data Filtering
  const filteredData = useMemo(() => {
    let result = data;
    if (filterStatus === 'stock') result = result.filter(item => item.status !== '已售出');
    if (filterStatus === 'sold') result = result.filter(item => item.status === '已售出');
    if (filterStreamer !== 'all') result = result.filter(item => item.holder === filterStreamer);
    if (filterBrand !== 'all') result = result.filter(item => item.brand === filterBrand);
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.type || '').toLowerCase().includes(lower) || 
        (item.brand || '').toLowerCase().includes(lower) || 
        (item.id || '').toLowerCase().includes(lower)
      );
    }
    // Sort
    result.sort((a, b) => {
       const getNum = (str) => parseInt((str || '').replace(/\D/g, '')) || 0;
       return getNum(b.id) - getNum(a.id);
    });
    return result;
  }, [data, searchTerm, filterStatus, filterStreamer, filterBrand]);

  const handleUpdateItem = (updated) => {
    setData(data.map(i => i.id === updated.id ? updated : i));
    setEditingItem(null);
  };
  const handleColorChange = (id, color) => {
    setData(data.map(i => i.id === id ? { ...i, bgColor: color } : i));
    setColorPickingItem(null);
  };
  const handleStreamerChange = (id, newHolder) => {
    setStreamerSwitchItem(null);
    updateData({ action: 'updateHolder', id, holder: newHolder });
  };

  // 定義動態欄位
  const extraFields = useMemo(() => {
    if (filterStatus === 'stock') {
      return [
        { key: 'buyPrice', label: '買進價格', icon: DollarSign },
        { key: 'buyDate', label: '買進時間', icon: Calendar },
        { key: 'sellerPlatform', label: '賣家平台', icon: Store },
      ];
    } else if (filterStatus === 'sold') {
      return [
        { key: 'sellPrice', label: '賣出價格', icon: DollarSign },
        { key: 'sellDate', label: '賣出時間', icon: Calendar },
        { key: 'buyerPlatform', label: '買家平台', icon: Store },
      ];
    }
    return [];
  }, [filterStatus]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wider">LUXURY STOCK</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400"><X /></button>
        </div>
        <nav className="mt-6">
          <button onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-6 py-4 hover:bg-slate-800 ${activeTab === 'dashboard' ? 'bg-slate-800 border-r-4 border-emerald-500' : ''}`}>
            <LayoutDashboard className="mr-3" size={20} /> 總覽儀表板
          </button>
          <button onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-6 py-4 hover:bg-slate-800 ${activeTab === 'inventory' ? 'bg-slate-800 border-r-4 border-emerald-500' : ''}`}>
            <Package className="mr-3" size={20} /> 庫存管理
          </button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 z-10 shrink-0">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-4 text-slate-500"><Menu size={24} /></button>
            <h2 className="text-lg md:text-xl font-bold text-slate-800">{activeTab === 'dashboard' ? '總覽' : '庫存'}</h2>
          </div>
          <div className="flex items-center gap-2">
            {loading ? (
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full flex items-center"><Loader2 className="animate-spin mr-1" size={12}/> 讀取中...</span>
            ) : GOOGLE_SCRIPT_URL ? (
               <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center cursor-pointer hover:bg-green-200" onClick={fetchData}><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span> Sheet 連線中</span>
            ) : (
               <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full flex items-center">預覽模式</span>
            )}
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth bg-slate-50">
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
          
          {activeTab === 'dashboard' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                   <p className="text-slate-500 text-xs mb-1">庫存總數</p>
                   <p className="text-2xl font-bold">{stats.stockCount} 件</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                   <p className="text-slate-500 text-xs mb-1">庫存成本</p>
                   <p className="text-2xl font-bold text-amber-600">{formatCurrency(stats.totalCost)}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                   <p className="text-slate-500 text-xs mb-1">本月已售出</p>
                   <p className="text-2xl font-bold text-emerald-600">{stats.monthlySold} 件</p>
                </div>
             </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-4 pb-20">
              {/* Filter Bar */}
              <div className="bg-white p-3 rounded-xl shadow-sm border space-y-3 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="搜尋..." className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-lg text-sm outline-none focus:ring-1 focus:ring-emerald-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="flex gap-2 overflow-x-auto items-center pb-1 md:pb-0">
                    <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
                      <button onClick={() => setFilterStatus('stock')} className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${filterStatus === 'stock' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>在庫</button>
                      <button onClick={() => setFilterStatus('sold')} className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${filterStatus === 'sold' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>已售出</button>
                      <button onClick={() => setFilterStatus('all')} className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${filterStatus === 'all' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>全部</button>
                    </div>
                    <select className="pl-2 pr-6 py-1.5 border rounded-lg bg-white text-xs font-bold text-slate-700" value={filterStreamer} onChange={e => setFilterStreamer(e.target.value)}>
                      <option value="all">所有直播主</option>
                      {STREAMERS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select className="pl-2 pr-6 py-1.5 border rounded-lg bg-white text-xs font-bold text-slate-700" value={filterBrand} onChange={e => setFilterBrand(e.target.value)}>
                      <option value="all">所有品牌</option>
                      {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
                      <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow text-emerald-600' : 'text-slate-400'}`}><Grid size={16} /></button>
                      <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow text-emerald-600' : 'text-slate-400'}`}><List size={16} /></button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t">
                  <span>條件: {filterStatus === 'stock' ? '在庫' : filterStatus === 'sold' ? '已售出' : '全部'} / {filterStreamer} / {filterBrand}</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">共 {filteredData.length} 件</span>
                </div>
              </div>

              {/* Views */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
                  {filteredData.map((item) => {
                    const bgColorClass = item.status === '已售出' 
                      ? (item.bgColor === 'white' ? BG_COLORS.gray : BG_COLORS[item.bgColor]) 
                      : BG_COLORS[item.bgColor] || BG_COLORS.white;

                    return (
                      <div key={item.id} className={`${bgColorClass} rounded-lg shadow-sm border border-black/5 overflow-hidden flex flex-col h-full relative group`}>
                        {/* Image */}
                        <div className="aspect-square bg-slate-200 relative overflow-hidden">
                          <ProductImage id={item.id} type={item.type} imageFileId={item.imageFileId} />
                          <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded z-10">{item.id}</div>
                          {/* Color Picker */}
                          <button onClick={(e) => { e.stopPropagation(); setColorPickingItem(item); }} className="absolute bottom-1 right-1 p-1.5 bg-white/80 rounded-full text-slate-500 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"><Palette size={14} /></button>
                        </div>
                        {/* Content */}
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-0.5">
                              <span className="text-[10px] text-slate-500 font-bold uppercase">{item.brand}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setStreamerSwitchItem(item); }}
                                className="text-[10px] font-bold text-slate-700 bg-black/5 px-2 py-0.5 rounded hover:bg-black/10 hover:text-emerald-700 transition-colors flex items-center"
                              >
                                {item.holder}
                              </button>
                            </div>
                            <h3 onClick={() => setEditingItem(item)} className="text-xs md:text-sm font-bold text-slate-800 line-clamp-2 leading-tight mb-2 cursor-pointer hover:underline">{item.type}</h3>
                          </div>
                          <div className="border-t border-black/5 pt-2 space-y-2">
                             <div className="flex justify-between items-end">
                              <div><div className="text-[10px] text-slate-500">同行價</div><div className="text-xs font-bold text-slate-700">{formatCurrency(item.peerPrice)}</div></div>
                              <div className="text-right"><div className="text-[10px] text-slate-500">售價</div><div className="text-sm md:text-base font-bold text-emerald-700">{formatCurrency(item.price)}</div></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden overflow-x-auto">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead className="bg-slate-50 text-slate-500 font-bold text-xs border-b uppercase">
                       <tr>
                         <th className="p-3">Color</th>
                         <th className="p-3">序號</th>
                         <th className="p-3">直播主</th>
                         <th className="p-3">品牌</th>
                         <th className="p-3">商品名稱</th>
                         {extraFields.map(f => (
                           <th key={f.key} className="p-3 text-slate-700 bg-slate-100/50">
                             {f.label}
                           </th>
                         ))}
                         <th className="p-3 text-right">同行價</th>
                         <th className="p-3 text-right">建議售價</th>
                         <th className="p-3">狀態</th>
                         <th className="p-3">操作</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {filteredData.map(item => {
                         const bgColorClass = item.status === '已售出' 
                           ? (item.bgColor === 'white' ? BG_COLORS.gray : BG_COLORS[item.bgColor]) 
                           : BG_COLORS[item.bgColor] || BG_COLORS.white;
                         
                         return (
                           <tr key={item.id} className={`${bgColorClass} hover:brightness-95 transition-all`}>
                             <td className="p-3"><div onClick={() => setColorPickingItem(item)} className={`w-4 h-4 rounded-full border border-black/10 cursor-pointer ${bgColorClass}`}></div></td>
                             <td className="p-3 font-mono font-bold text-slate-700">{item.id}</td>
                             <td className="p-3">
                               <button onClick={() => setStreamerSwitchItem(item)} className="flex items-center gap-1 px-2 py-1 bg-white/50 hover:bg-white border rounded text-xs font-bold text-slate-700">
                                 {item.holder} <ArrowRightLeft size={12}/>
                               </button>
                             </td>
                             <td className="p-3 font-medium text-slate-600">{item.brand}</td>
                             <td className="p-3 max-w-xs truncate font-medium text-slate-900 cursor-pointer hover:underline" onClick={() => setEditingItem(item)}>{item.type}</td>
                             {extraFields.map(f => (
                               <td key={f.key} className="p-3 text-xs text-slate-600 font-mono">
                                  {f.key.includes('Price') ? formatCurrency(item[f.key]) : (item[f.key] || '-')}
                               </td>
                             ))}
                             <td className="p-3 text-right font-mono text-slate-600">{formatCurrency(item.peerPrice)}</td>
                             <td className="p-3 text-right font-mono font-bold text-emerald-700">{formatCurrency(item.price)}</td>
                             <td className="p-3 text-xs font-bold">{item.status}</td>
                             <td className="p-3 text-center">
                               <button onClick={() => setEditingItem(item)} className="text-slate-500 hover:text-slate-800"><Edit3 size={16} /></button>
                             </td>
                           </tr>
                         );
                       })}
                     </tbody>
                   </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {editingItem && <EditModal item={editingItem} onClose={() => setEditingItem(null)} onSave={handleUpdateItem} />}
      {colorPickingItem && <ColorPickerModal item={colorPickingItem} onClose={() => setColorPickingItem(null)} onSave={handleColorChange} />}
      {streamerSwitchItem && <StreamerSwitchModal item={streamerSwitchItem} onClose={() => setStreamerSwitchItem(null)} onSave={handleStreamerChange} />}
    </div>
  );
}
