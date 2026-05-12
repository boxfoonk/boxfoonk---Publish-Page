import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import jsQR from 'jsqr';
import JSZip from 'jszip';
import CryptoJS from 'crypto-js';
import { 
  ArrowLeft, Search, Image as ImageIcon, Code, Lock, Shield, 
  Search as SearchIcon, CircleDollarSign, QrCode, FileJson, 
  Clock, Globe, Hash, Zap, Cpu, Link as LinkIcon, Database, 
  Eye, Save, RefreshCw, Copy, Check, Download, Upload,
  Key, Radio, Monitor, Server, MapPin, Calculator, TrendingUp,
  Type, Binary, ChevronRight, Share2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';

type Category = 'all' | 'image' | 'dev' | 'security' | 'query' | 'finance';

interface Tool {
  id: string;
  name: string;
  desc: string;
  icon: any;
  category: Category;
  component: React.FC;
}

export default function Toolbox({ onBack }: { onBack: () => void }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const categories = [
    { id: 'all', name: '全部分类', icon: Zap },
    { id: 'image', name: '图像功能', icon: ImageIcon },
    { id: 'dev', name: '开发助手', icon: Code },
    { id: 'security', name: '安全加密', icon: Shield },
    { id: 'query', name: '信息查询', icon: SearchIcon },
    { id: 'finance', name: '金融工具', icon: CircleDollarSign },
  ];

  const tools: Tool[] = [
    // Image Tools
    { id: 'qrcode-reader', name: '二维码识别', desc: '识别图片或剪贴板中的二维码内容', icon: SearchIcon, category: 'image', component: QRCodeReader },
    { id: 'qrcode-gen', name: '二维码制作', desc: '快速生成自定义内容的二维码', icon: QrCode, category: 'image', component: QRCodeGen },
    { id: 'img-base64', name: '图像转Base64', desc: '将图片转换为Base64编码字符串', icon: ImageIcon, category: 'image', component: ImageToBase64 },
    { id: 'img-pack', name: '图片打包', desc: '多张图片资源在线合成与打包', icon: Database, category: 'image', component: ImagePacker },
    
    // Dev Tools
    { id: 'json-format', name: 'JSON工具', desc: 'JSON格式化、校验与压缩', icon: FileJson, category: 'dev', component: JSONFormatter },
    { id: 'json-go', name: 'JSON转Go Struct', desc: '将JSON字符串转换为Go结构体定义', icon: Database, category: 'dev', component: JSONToGo },
    { id: 'unix-time', name: 'Unix时间戳', desc: '时间戳与日期互转工具', icon: Clock, category: 'dev', component: UnixTimestamp },
    { id: 'url-parser', name: 'URL参数解析', desc: 'URL参数转JSON及解析', icon: LinkIcon, category: 'dev', component: URLParser },
    { id: 'url-codec', name: 'URL解编码', desc: '对链接进行URL安全编解码处理', icon: RefreshCw, category: 'dev', component: URLCodec },
    { id: 'text-base64', name: 'Base64文本编解码', desc: '普通的Base64文本转换', icon: Binary, category: 'dev', component: Base64TextCodec },
    { id: 'text-case', name: '文本大小写', desc: '多种文本格式转换（大写、小写、驼峰等）', icon: Type, category: 'dev', component: TextCaseConverter },
    { id: 'hash-gen', name: '哈希生成器', desc: 'MD5, SHA1, SHA256等快速计算', icon: Hash, category: 'dev', component: HashGenerator },
    { id: 'unit-conv', name: '单位换算器', desc: '长度、重量、数据量等转换', icon: Calculator, category: 'dev', component: UnitConverter },
    { id: 'http-status', name: 'HTTP状态码', desc: '常用HTTP状态码详细释义', icon: Globe, category: 'dev', component: HTTPStatusCodes },
    { id: 'favicon-fetch', name: '网站图标获取', desc: '快速获取任意网站的Favicon', icon: Globe, category: 'dev', component: FaviconFetcher },
    
    // Security
    { id: 'rsa-tool', name: 'RSA加密解密', desc: 'RSA非对称加密、解密及密钥生成', icon: Lock, category: 'security', component: RSATool },
    { id: 'pass-gen', name: '密码生成器', desc: '生成高强度随机密码', icon: Key, category: 'security', component: PasswordGenerator },
    { id: 'jwt-tool', name: 'JWT编解码', desc: 'JSON Web Token解析与验证', icon: Shield, category: 'security', component: JWTTool },
    { id: 'morse-code', name: '摩斯电码', desc: '文字与摩斯电码互相转换', icon: Radio, category: 'security', component: MorseCodec },
    
    // Query
    { id: 'whois-query', name: 'Whois查询', desc: '查询域名注册信息与到期时间', icon: SearchIcon, category: 'query', component: WhoisQuery },
    { id: 'dns-list', name: '公共DNS大全', desc: '全球热门公共DNS服务器列表', icon: Globe, category: 'query', component: PublicDNSList },
    { id: 'ntp-list', name: '公共NTP服务', desc: '常用网络时间同步服务器', icon: Clock, category: 'query', component: PublicNTPList },
    { id: 'tld-list', name: '顶级域名后缀', desc: '常用与各地区顶级域名查询', icon: Hash, category: 'query', component: TLDSuffixes },
    { id: 'dns-query', name: 'DNS查询', desc: '全球多节点DNS记录查询', icon: Server, category: 'query', component: DNSQuery },
    { id: 'ip-info', name: 'IP集成查询', desc: '查询当前IP、地理位置及运营商信息', icon: MapPin, category: 'query', component: IPInfo },
    { id: 'network-test', name: '连接可用性', desc: '检测当前网络环境与连接稳定性', icon: Zap, category: 'query', component: NetworkDiagnostic },
    { id: 'world-time', name: '各国首都时间', desc: '全球城市实时时间与时标查询', icon: MapPin, category: 'query', component: WorldTime },
    { id: 'mac-vendor', name: 'MAC厂商查询', desc: '通过MAC地址查询设备制造商', icon: Monitor, category: 'query', component: MACVendor },
    
    // Finance
    { id: 'exchange-rate', name: '汇率换算', desc: '全球主流货币实时汇率转换', icon: Calculator, category: 'finance', component: ExchangeRate },
    { id: 'cnh-rate', name: '离岸人民币汇率', desc: 'CNH实时行情与走势查询', icon: TrendingUp, category: 'finance', component: CNHRate },
  ];

  useEffect(() => {
    const toolId = searchParams.get('tool');
    if (toolId) {
      const tool = tools.find(t => t.id === toolId);
      if (tool) setSelectedTool(tool);
    }
  }, [searchParams]);

  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(tool);
    setSearchParams({ tool: tool.id }, { replace: true });
  };

  const handleCloseModal = () => {
    setSelectedTool(null);
    setSearchParams({}, { replace: true });
  };

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <motion.button
              onClick={onBack}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              返回主页
            </motion.button>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">工具箱</h1>
            <p className="text-zinc-400 mt-2">聚合开发与生活的常用高效工具</p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input 
              type="text" 
              placeholder="搜索工具..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-3 pb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as Category)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-full border whitespace-nowrap transition-all duration-300",
                activeCategory === cat.id 
                  ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20" 
                  : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
              )}
            >
              <cat.icon size={18} />
              <span className="font-bold text-sm">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, idx) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => handleSelectTool(tool)}
                className="group p-6 rounded-[2rem] bg-black/40 backdrop-blur-3xl border border-white/10 hover:border-rose-500/40 hover:bg-white/[0.05] transition-all cursor-pointer flex flex-col gap-4 shadow-xl shadow-black/20"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-rose-400 group-hover:bg-rose-500/10 transition-all duration-500">
                    <tool.icon size={24} />
                  </div>
                  <ChevronRight size={18} className="text-zinc-600 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">{tool.name}</h3>
                  <p className="text-sm text-zinc-500 line-clamp-2">{tool.desc}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Tool Modal */}
        <AnimatePresence>
          {selectedTool && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0a0212] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden shadow-black/80"
              >
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400">
                      <selectedTool.icon size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white leading-tight">{selectedTool.name}</h2>
                      <p className="text-zinc-500 text-sm">{selectedTool.desc}</p>
                    </div>
                  </div>
                    <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            const url = window.location.origin + window.location.pathname + '?tool=' + selectedTool.id;
                            navigator.clipboard.writeText(url);
                            setShareStatus('copied');
                            setTimeout(() => setShareStatus('idle'), 2000);
                          }}
                          className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all relative flex items-center justify-center"
                          title="分享此工具"
                        >
                          <AnimatePresence mode="wait">
                            {shareStatus === 'copied' ? (
                                <motion.div
                                    key="check"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    className="text-green-500 flex items-center gap-1"
                                >
                                    <Check size={18} />
                                    <span className="text-[10px] font-bold absolute -top-8 bg-green-500 text-white px-2 py-1 rounded whitespace-nowrap shadow-lg">链接已复制</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="share"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                >
                                    <Share2 size={20} />
                                </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                    <button 
                      onClick={handleCloseModal}
                      className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
                    >
                      <XIcon size={24} />
                    </button>
                  </div>
                </div>
                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <selectedTool.component />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Shared Components ---

function XIcon({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button 
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold transition-all"
    >
      {copied ? <><Check size={14} className="text-green-400" /> 已复制</> : <><Copy size={14} /> 复制内容</>}
    </button>
  );
};

// --- Tool Components ---

// 0. QRCode Reader
const QRCodeReader = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scanImage = (file: File) => {
    setIsProcessing(true);
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            setResult(code.data);
          } else {
            setError('未能识别到二维码，请尝试更清晰的图片');
          }
        } catch (err) {
          console.error('Scan error:', err);
          setError('识别过程中出错，请尝试其他图片');
        } finally {
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setError('图片加载失败');
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setError('文件读取失败');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) scanImage(file);
  };

  const handlePaste = async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        throw new Error('NOT_SUPPORTED');
      }
      
      const items = await navigator.clipboard.read();
      let found = false;
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const file = new File([blob], 'pasted-image.png', { type });
            scanImage(file);
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (!found) setError('剪贴板中未发现图片，请确认你已复制了二维码图像');
    } catch (err) {
      console.error('Clipboard read error:', err);
      setError('无法直接读取剪贴板。请尝试直接在页面按下 Ctrl+V (或 Cmd+V) 进行粘贴识别，或者手动上传图片。');
    }
  };

  useEffect(() => {
    const onGlobalPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              scanImage(blob);
              return;
            }
          }
        }
      }
    };

    window.addEventListener('paste', onGlobalPaste);
    return () => window.removeEventListener('paste', onGlobalPaste);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative group cursor-pointer">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleUpload}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center group-hover:border-rose-500/50 transition-all flex flex-col items-center justify-center min-h-[160px] bg-white/5">
            <Upload className="mb-4 text-zinc-500 group-hover:text-rose-400 transition-colors" size={32} />
            <p className="text-zinc-400 text-sm font-bold">上传二维码图片</p>
          </div>
        </div>

        <button 
          onClick={handlePaste}
          className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-rose-500/50 transition-all flex flex-col items-center justify-center min-h-[160px] bg-white/5 group"
        >
          <RefreshCw className="mb-4 text-zinc-500 group-hover:text-rose-400 transition-colors" size={32} />
          <p className="text-zinc-400 text-sm font-bold">粘贴图片识别</p>
          <p className="text-[10px] text-zinc-600 mt-2">支持快捷键 Ctrl+V / Cmd+V</p>
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {isProcessing && (
        <div className="p-4 bg-white/5 rounded-2xl text-center">
            <RefreshCw className="animate-spin mx-auto text-rose-500 mb-2" size={24} />
            <p className="text-xs text-zinc-500 uppercase tracking-widest">识别中...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center font-bold">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">识别结果</h4>
            <CopyButton text={result} />
          </div>
          <div className="p-6 bg-black/40 border border-white/10 rounded-2xl text-rose-400 font-mono text-sm break-all">
            {result}
          </div>
          {result.startsWith('http') && (
            <a 
              href={result} 
              target="_blank" 
              rel="noreferrer"
              className="block w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-center transition-colors"
            >
              访问链接
            </a>
          )}
        </div>
      )}
    </div>
  );
};

const QRCodeGen = () => {
  const [text, setText] = useState('https://boxfoonk.com');
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">输入内容</label>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          placeholder="输入网址、文本或任何内容..."
        />
      </div>
      <div className="flex flex-col items-center gap-4 bg-white/5 p-8 rounded-3xl border border-white/5">
        <div className="p-4 bg-white rounded-2xl shadow-2xl">
          <QRCodeSVG value={text} size={200} />
        </div>
        <p className="text-xs text-zinc-500">手机扫一扫，实时预览内容</p>
      </div>
    </div>
  );
};

const ImageToBase64 = () => {
  const [base64, setBase64] = useState('');
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="space-y-6">
      <div className="relative group cursor-pointer">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleUpload}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center group-hover:border-rose-500/50 transition-all">
          <Upload className="mx-auto mb-4 text-zinc-500 group-hover:text-rose-400 transition-colors" size={32} />
          <p className="text-zinc-400">点击或拖拽图片到此处上传</p>
        </div>
      </div>
      {base64 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Base64 结果</h4>
            <CopyButton text={base64} />
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono text-zinc-400 break-all max-h-40 overflow-y-auto font-mono">
            {base64}
          </div>
        </div>
      )}
    </div>
  );
};

const ImagePacker = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isPacking, setIsPacking] = useState(false);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const packImages = async () => {
        if (files.length === 0) return;
        setIsPacking(true);
        try {
            const zip = new JSZip();
            files.forEach((file, index) => {
                zip.file(file.name || `image_${index}.png`, file);
            });
            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = `images_pack_${format(new Date(), 'yyyyMMdd_HHmmss')}.zip`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Packing error:', err);
        } finally {
            setIsPacking(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="relative group cursor-pointer">
                <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center group-hover:border-rose-500/50 transition-all flex flex-col items-center justify-center min-h-[120px] bg-white/5">
                    <Upload className="mb-2 text-zinc-500 group-hover:text-rose-400 transition-colors" size={24} />
                    <p className="text-zinc-400 text-sm font-bold">添加多张图片</p>
                </div>
            </div>

            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">已选择 {files.length} 张图片</span>
                        <button onClick={() => setFiles([])} className="text-xs text-rose-500 hover:underline">清空列表</button>
                    </div>
                    <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-black/20 rounded-xl border border-white/5">
                        {files.map((file, i) => (
                            <div key={i} className="relative aspect-square group">
                                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover rounded-lg border border-white/10" />
                                <button 
                                    onClick={() => removeFile(i)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <XIcon size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button 
                        disabled={isPacking}
                        onClick={packImages}
                        className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold rounded-2xl tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                        {isPacking ? (
                            <><RefreshCw className="animate-spin" size={18} /> 打包中...</>
                        ) : (
                            <><Download size={18} /> 打包并下载 ZIP</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

const Base64TextCodec = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const encode = () => { try { setOutput(btoa(unescape(encodeURIComponent(input)))); } catch { setOutput('编码失败'); } };
    const decode = () => { try { setOutput(decodeURIComponent(escape(atob(input)))); } catch { setOutput('解码失败'); } };
    return (
        <div className="space-y-6">
            <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-mono text-sm" placeholder="输入文本或 Base64..." />
            <div className="flex gap-4">
                <button onClick={encode} className="flex-1 py-3 bg-rose-500 rounded-xl font-bold">编码</button>
                <button onClick={decode} className="flex-1 bg-white/5 rounded-xl font-bold border border-white/10">解码</button>
            </div>
            {output && (
                <div className="space-y-2">
                    <div className="flex justify-between items-center"><p className="text-xs font-bold text-zinc-500 uppercase">结果</p><CopyButton text={output} /></div>
                    <div className="p-4 bg-black/40 rounded-2xl break-all text-rose-400 font-mono text-sm">{output}</div>
                </div>
            )}
        </div>
    );
};

const TextCaseConverter = () => {
    const [text, setText] = useState('Hello World');
    const convert = (type: string) => {
        let res = text;
        if (type === 'upper') res = text.toUpperCase();
        if (type === 'lower') res = text.toLowerCase();
        if (type === 'camel') res = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, '');
        if (type === 'snake') res = text.replace(/\W+/g, " ").split(/ |\B(?=[A-Z])/).map(word => word.toLowerCase()).join('_');
        setText(res);
    };
    return (
        <div className="space-y-6">
            <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-mono" />
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => convert('upper')} className="py-2 bg-white/5 rounded-lg text-xs font-bold hover:bg-rose-500 transition-colors">UPPERCASE</button>
                <button onClick={() => convert('lower')} className="py-2 bg-white/5 rounded-lg text-xs font-bold hover:bg-rose-500 transition-colors">lowercase</button>
                <button onClick={() => convert('camel')} className="py-2 bg-white/5 rounded-lg text-xs font-bold hover:bg-rose-500 transition-colors">camelCase</button>
                <button onClick={() => convert('snake')} className="py-2 bg-white/5 rounded-lg text-xs font-bold hover:bg-rose-500 transition-colors">snake_case</button>
            </div>
            <div className="flex justify-end"><CopyButton text={text} /></div>
        </div>
    );
};

const HashGenerator = () => {
    const [input, setInput] = useState('');
    const [hashes, setHashes] = useState<any[]>([]);
    const generate = () => {
        setHashes([
            { name: 'MD5', val: CryptoJS.MD5(input).toString() },
            { name: 'SHA1', val: CryptoJS.SHA1(input).toString() },
            { name: 'SHA256', val: CryptoJS.SHA256(input).toString() },
            { name: 'SHA512', val: CryptoJS.SHA512(input).toString() },
        ]);
    };
    return (
        <div className="space-y-6">
            <textarea value={input} onChange={e => setInput(e.target.value)} className="w-full h-24 p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-mono text-xs" placeholder="输入要哈希的文本..." />
            <button onClick={generate} className="w-full py-3 bg-rose-500 rounded-xl font-bold">生成哈希</button>
            <div className="space-y-3">
                {hashes.map(h => (
                    <div key={h.name} className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-1">
                        <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-zinc-500 uppercase">{h.name}</span><CopyButton text={h.val} /></div>
                        <p className="text-xs font-mono text-rose-400 break-all">{h.val}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const UnitConverter = () => {
    const [val, setVal] = useState('1');
    const [type, setType] = useState('length'); // length, data
    const units = type === 'length' ? [
        { name: '米 (m)', ratio: 1 },
        { name: '厘米 (cm)', ratio: 0.01 },
        { name: '毫米 (mm)', ratio: 0.001 },
        { name: '千米 (km)', ratio: 1000 },
        { name: '英寸 (in)', ratio: 0.0254 },
        { name: '英尺 (ft)', ratio: 0.3048 }
    ] : [
        { name: 'B', ratio: 1 },
        { name: 'KB', ratio: 1024 },
        { name: 'MB', ratio: 1024 * 1024 },
        { name: 'GB', ratio: 1024 * 1024 * 1024 }
    ];
    
    return (
        <div className="space-y-6">
            <div className="flex gap-2 p-1 bg-black/40 rounded-xl w-fit mx-auto">
                <button onClick={() => setType('length')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold", type === 'length' ? "bg-rose-500 text-white" : "text-zinc-500")}>长度</button>
                <button onClick={() => setType('data')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold", type === 'data' ? "bg-rose-500 text-white" : "text-zinc-500")}>数据量</button>
            </div>
            <input type="number" value={val} onChange={e => setVal(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xl text-center" />
            <div className="grid grid-cols-2 gap-3">
                {units.map(u => (
                    <div key={u.name} className="p-3 bg-black/20 rounded-xl border border-white/5 text-center">
                        <p className="text-[10px] text-zinc-500 mb-1">{u.name}</p>
                        <p className="text-white font-mono text-sm">{(Number(val) / u.ratio).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const JSONFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e: any) {
      setError('无效的 JSON 格式: ' + e.message);
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e: any) {
      setError('无效的 JSON 格式: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">原始 JSON</label>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            placeholder="粘贴 JSON 到这里..."
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">转换结果</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea 
            readOnly
            value={output}
            className="w-full h-80 p-4 bg-black/40 border border-white/10 rounded-2xl text-rose-400 font-mono text-xs focus:outline-none"
            placeholder="结果将显示在这里..."
          />
        </div>
      </div>
      {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
      <div className="flex gap-4">
        <button onClick={formatJSON} className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors">美化格式</button>
        <button onClick={minifyJSON} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors">压缩解析</button>
      </div>
    </div>
  );
};

const JSONToGo = () => {
    const [json, setJson] = useState('{"name": "test", "age": 18, "active": true}');
    const [go, setGo] = useState('');
    const convert = () => {
        try {
            const obj = JSON.parse(json);
            let res = 'type AutoGenerated struct {\n';
            for (const key in obj) {
                const type = typeof obj[key];
                const goType = type === 'string' ? 'string' : type === 'number' ? 'int' : type === 'boolean' ? 'bool' : 'interface{}';
                const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
                res += `\t${capitalized} ${goType} \`json:"${key}"\`\n`;
            }
            res += '}';
            setGo(res);
        } catch { setGo('无效的 JSON'); }
    }
    return (
        <div className="space-y-6">
            <textarea value={json} onChange={e => setJson(e.target.value)} className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-mono text-xs" />
            <button onClick={convert} className="w-full py-3 bg-rose-500 rounded-xl font-bold">转换</button>
            <textarea readOnly value={go} className="w-full h-48 p-4 bg-black/40 border border-white/5 rounded-2xl text-zinc-400 font-mono text-xs" />
        </div>
    )
}

const UnixTimestamp = () => {
  const [timestamp, setTimestamp] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [currentTs, setCurrentTs] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    setTimestamp(Math.floor(Date.now() / 1000).toString());
    setDateStr(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    
    const timer = setInterval(() => {
      setCurrentTs(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toDate = () => {
    try {
      const ts = parseInt(timestamp);
      if (isNaN(ts)) {
        setDateStr('无效的时间戳');
        return;
      }
      const date = new Date(ts * (timestamp.length > 10 ? 1 : 1000));
      if (isNaN(date.getTime())) {
        setDateStr('无效的时间戳');
        return;
      }
      setDateStr(format(date, 'yyyy-MM-dd HH:mm:ss'));
    } catch {
      setDateStr('转换出错');
    }
  };

  const toTimestamp = () => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        setTimestamp('无效的日期');
        return;
      }
      const ts = Math.floor(date.getTime() / 1000);
      setTimestamp(ts.toString());
    } catch {
      setTimestamp('转换出错');
    }
  };

  return (
    <div className="space-y-8">
      <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-center">
        <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2">当前时间戳 (Unix Timestamp)</p>
        <p className="text-4xl font-black text-rose-500 tracking-tighter">{currentTs}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">时间戳 → 日期 (s)</label>
          <input 
            type="text" 
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 font-mono"
            placeholder="输入 10 位时间戳"
          />
          <button onClick={toDate} className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-sm font-bold transition-all">转换成日期</button>
          <div className="p-3 bg-black/20 rounded-xl text-zinc-300 font-mono text-center min-h-[48px] flex items-center justify-center border border-white/5">{dateStr}</div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">日期 → 时间戳</label>
          <input 
            type="text" 
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 font-mono"
            placeholder="YYYY-MM-DD HH:mm:ss"
          />
          <button onClick={toTimestamp} className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-sm font-bold transition-all">转换成时间戳</button>
          <div className="p-3 bg-black/20 rounded-xl text-zinc-300 font-mono text-center min-h-[48px] flex items-center justify-center border border-white/5">{timestamp}</div>
        </div>
      </div>
    </div>
  );
};

const URLParser = () => {
  const [url, setUrl] = useState('https://boxfoonk.com/search?q=tech&category=android#main');
  const [result, setResult] = useState<any>(null);

  const parseURL = () => {
    try {
      const u = new URL(url);
      const params: any = {};
      u.searchParams.forEach((v, k) => params[k] = v);
      setResult({
        protocol: u.protocol,
        hostname: u.hostname,
        pathname: u.pathname,
        params,
        hash: u.hash
      });
    } catch {
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      <input 
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm"
        placeholder="输入完整 URL..."
      />
      <button onClick={parseURL} className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl">解析参数</button>
      
      {result && (
        <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-zinc-500 mb-1">协议</p>
              <p className="text-white font-mono">{result.protocol}</p>
            </div>
            <div>
              <p className="text-zinc-500 mb-1">域名</p>
              <p className="text-white font-mono">{result.hostname}</p>
            </div>
          </div>
          <div>
            <p className="text-zinc-500 mb-1 text-xs">参数列表</p>
            <div className="p-3 bg-white/5 rounded-xl text-xs font-mono text-zinc-300">
              {JSON.stringify(result.params, null, 2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const URLCodec = () => {
    const [text, setText] = useState('https://boxfoonk.com?name=张三');
    const [res, setRes] = useState('');
    return (
        <div className="space-y-6">
            <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-24 p-4 bg-white/5 border border-white/10 rounded-2xl text-white" />
            <div className="flex gap-4">
                <button onClick={() => setRes(encodeURIComponent(text))} className="flex-1 py-3 bg-rose-500 rounded-xl font-bold">编码</button>
                <button onClick={() => setRes(decodeURIComponent(text))} className="flex-1 py-3 bg-white/5 rounded-xl font-bold">解码</button>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl break-all text-zinc-400 font-mono text-xs">{res}</div>
        </div>
    )
}

const HTTPStatusCodes = () => {
    const codes = [
        { code: 200, name: 'OK', desc: '请求成功' },
        { code: 404, name: 'Not Found', desc: '未找到资源' },
        { code: 500, name: 'Internal Server Error', desc: '服务器内部错误' },
        { code: 403, name: 'Forbidden', desc: '拒绝访问' },
        { code: 401, name: 'Unauthorized', desc: '未授权' },
    ];
    return (
        <div className="space-y-3">
            {codes.map(c => (
                <div key={c.code} className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center gap-4">
                    <span className="text-xl font-black text-rose-500 w-12">{c.code}</span>
                    <div>
                        <p className="font-bold text-white">{c.name}</p>
                        <p className="text-xs text-zinc-500">{c.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const FaviconFetcher = () => {
    const [domain, setDomain] = useState('google.com');
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    return (
        <div className="space-y-6">
            <input 
              type="text" 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white"
              placeholder="输入域名如 google.com"
            />
            <div className="flex flex-col items-center gap-4 p-8 bg-black/20 rounded-3xl">
                <img src={faviconUrl} alt="favicon" className="w-24 h-24 rounded-2xl shadow-2xl bg-white p-2" />
                <p className="text-xs text-zinc-500">{domain} 的图标</p>
                <div className="flex gap-2">
                    <a href={faviconUrl} download target="_blank" className="px-6 py-2 bg-rose-500 text-white font-bold rounded-xl text-sm">下载高清图标</a>
                </div>
            </div>
        </div>
    );
};

const RSATool = () => {
    const [keyPair, setKeyPair] = useState<{ publicKey: CryptoKey, privateKey: CryptoKey, pubBase64: string, priBase64: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
    const [error, setError] = useState('');

    const generateKeys = async () => {
        if (!window.crypto || !window.crypto.subtle) {
            setError('您的浏览器不支持 Web Crypto API，或者当前不是安全上下文 (HTTPS)。');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const keys = await window.crypto.subtle.generateKey(
                {
                    name: "RSA-OAEP",
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: "SHA-256",
                },
                true,
                ["encrypt", "decrypt"]
            );

            const pub = await window.crypto.subtle.exportKey("spki", keys.publicKey);
            const pri = await window.crypto.subtle.exportKey("pkcs8", keys.privateKey);

            const pubBase64 = btoa(Array.from(new Uint8Array(pub)).map(b => String.fromCharCode(b)).join(''));
            const priBase64 = btoa(Array.from(new Uint8Array(pri)).map(b => String.fromCharCode(b)).join(''));

            setKeyPair({ 
                publicKey: keys.publicKey,
                privateKey: keys.privateKey,
                pubBase64: `-----BEGIN PUBLIC KEY-----\n${pubBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`,
                priBase64: `-----BEGIN PRIVATE KEY-----\n${priBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`
            });
        } catch (e: any) {
            console.error(e);
            setError('密钥生成失败: ' + e.message);
        }
        setLoading(false);
    };

    const process = async () => {
        if (!keyPair) return;
        setError('');
        try {
            if (mode === 'encrypt') {
                const encoded = new TextEncoder().encode(inputText);
                const encrypted = await window.crypto.subtle.encrypt(
                    { name: "RSA-OAEP" },
                    keyPair.publicKey,
                    encoded
                );
                const encryptedBase64 = btoa(Array.from(new Uint8Array(encrypted)).map(b => String.fromCharCode(b)).join(''));
                setOutputText(encryptedBase64);
            } else {
                const decoded = new Uint8Array(atob(inputText).split("").map(c => c.charCodeAt(0)));
                const decrypted = await window.crypto.subtle.decrypt(
                    { name: "RSA-OAEP" },
                    keyPair.privateKey,
                    decoded
                );
                setOutputText(new TextDecoder().decode(decrypted));
            }
        } catch (e: any) {
            console.error(e);
            setOutputText('');
            setError('处理失败：请确认密钥匹配且输入格式正确（RSA-2048 加密内容长度有限）');
        }
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold">
                    {error}
                </div>
            )}
            <div className="p-8 bg-black/20 rounded-3xl text-center border border-white/5">
                <button 
                    disabled={loading}
                    onClick={generateKeys}
                    className="px-6 py-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-xl font-bold transition-all"
                >
                    {loading ? '生成中...' : (keyPair ? '重新生成密钥对' : '生成新密钥对')}
                </button>
            </div>
            
            {keyPair && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <p className="text-xs font-bold text-zinc-500 uppercase">公钥</p>
                                <CopyButton text={keyPair.pubBase64} />
                            </div>
                            <textarea readOnly value={keyPair.pubBase64} className="w-full h-32 bg-white/5 rounded-xl p-3 text-[10px] font-mono text-zinc-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-bold text-zinc-500 uppercase">私钥</p>
                                <CopyButton text={keyPair.priBase64} />
                            </div>
                            <textarea readOnly value={keyPair.priBase64} className="w-full h-32 bg-white/5 rounded-xl p-3 text-[10px] font-mono text-zinc-500" />
                        </div>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                        <div className="flex gap-2 p-1 bg-black/40 rounded-xl w-fit mx-auto">
                            <button onClick={() => setMode('encrypt')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold", mode === 'encrypt' ? "bg-rose-500 text-white" : "text-zinc-500")}>加密</button>
                            <button onClick={() => setMode('decrypt')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold", mode === 'decrypt' ? "bg-rose-500 text-white" : "text-zinc-500")}>解密</button>
                        </div>
                        <textarea value={inputText} onChange={e => setInputText(e.target.value)} className="w-full h-24 p-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm" placeholder="输入内容..." />
                        <button onClick={process} className="w-full py-3 bg-rose-500 rounded-xl font-bold">处理</button>
                        {outputText && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center"><p className="text-xs font-bold text-zinc-500">结果</p><CopyButton text={outputText} /></div>
                                <div className="p-4 bg-black/40 border border-white/10 rounded-2xl text-rose-400 font-mono text-sm break-all">{outputText}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState('');
  const generate = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let res = '';
    for (let i = 0; i < length; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    setPassword(res);
  };
  useEffect(() => { generate(); }, []);
  return (
    <div className="space-y-8">
      <div className="p-8 bg-zinc-900/50 border border-white/10 rounded-3xl text-center">
        <p className="text-2xl font-mono text-rose-400 break-all">{password || '...'}</p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-zinc-400"><span>长度: {length}</span></div>
        <input type="range" min="8" max="64" value={length} onChange={e => setLength(parseInt(e.target.value))} className="w-full accent-rose-500" />
        <div className="flex gap-4">
          <button onClick={generate} className="flex-1 py-4 bg-rose-500 rounded-2xl font-bold">生成密码</button>
          {password && <CopyButton text={password} />}
        </div>
      </div>
    </div>
  );
};

const JWTTool = () => {
  const [token, setToken] = useState('');
  const [payload, setPayload] = useState('');
  const decode = () => {
    try {
      const parts = token.split('.');
      if (parts.length < 2) throw new Error();
      const decoded = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      setPayload(JSON.stringify(JSON.parse(decoded), null, 2));
    } catch { setPayload('无效 Token'); }
  };
  return (
    <div className="space-y-6">
      <textarea value={token} onChange={e => setToken(e.target.value)} className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-mono" placeholder="粘贴 JWT..." />
      <button onClick={decode} className="w-full py-3 bg-indigo-500 rounded-xl font-bold">解析 Payload</button>
      <div className="p-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-mono text-zinc-400 whitespace-pre overflow-x-auto">{payload || '...'}</div>
    </div>
  );
};

const MorseCodec = () => {
  const [text, setText] = useState('SOS');
  const [mode, setMode] = useState<'textToMorse' | 'morseToText'>('textToMorse');
  const morseMap: Record<string, string> = {'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'};
  const reverseMorseMap = Object.entries(morseMap).reduce((acc, [char, code]) => { acc[code] = char; return acc; }, {} as Record<string, string>);
  const encode = (str: string) => str.toUpperCase().split('').map(c => morseMap[c] || c).join(' ');
  const decode = (str: string) => str.split(' ').map(c => reverseMorseMap[c] || c).join('');
  const result = mode === 'textToMorse' ? encode(text) : decode(text);
  return (
    <div className="space-y-6">
        <div className="flex gap-2 p-1 bg-black/40 rounded-xl w-fit mx-auto">
            <button onClick={() => setMode('textToMorse')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold", mode === 'textToMorse' ? "bg-rose-500 text-white" : "text-zinc-500")}>文字转摩斯</button>
            <button onClick={() => setMode('morseToText')} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold", mode === 'morseToText' ? "bg-rose-500 text-white" : "text-zinc-500")}>摩斯转文字</button>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-24 p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-mono" />
        <div className="p-6 bg-black/40 border border-white/10 rounded-2xl font-mono text-rose-400 break-all">{result || '...'}</div>
    </div>
  );
};

const WhoisQuery = () => {
    const [domain, setDomain] = useState('google.com');
    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <input value={domain} onChange={e => setDomain(e.target.value)} className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-white" />
                <button className="px-6 py-2 bg-rose-500 rounded-xl font-bold">查询</button>
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-[10px] text-amber-400 font-bold uppercase mb-1">注意</p>
                <p className="text-[10px] text-amber-500/80 leading-relaxed">由于浏览器安全限制 (CORS)，前端无法直接进行 WHOIS 查询。以下为演示数据，点击查询可跳转外部专业工具。</p>
            </div>
            <div className="p-6 bg-black/40 rounded-2xl space-y-2 text-sm">
                <p className="flex justify-between"><span className="text-zinc-500">注册商:</span><span className="text-white">MarkMonitor Inc.</span></p>
                <p className="flex justify-between"><span className="text-zinc-500">注册日期:</span><span className="text-white">1997-09-15</span></p>
                <p className="flex justify-between"><span className="text-zinc-500">到期日期:</span><span className="text-white">2028-09-14</span></p>
            </div>
            <a href={`https://whois.aliyun.com/whois/domain/${domain}`} target="_blank" rel="noreferrer" className="block text-center text-xs text-rose-400 hover:underline">去阿里云查询实时 WHOIS</a>
        </div>
    );
};

const PublicDNSList = () => {
    const dns = [{ name: 'Google DNS', p: '8.8.8.8', s: '8.8.4.4' }, { name: 'Cloudflare', p: '1.1.1.1', s: '1.0.0.1' }, { name: 'AliDNS', p: '223.5.5.5', s: '223.6.6.6' }, { name: 'DNSPod', p: '119.29.29.29', s: '182.254.116.116' }];
    return (
        <div className="space-y-3">
            {dns.map(d => (
                <div key={d.name} className="p-4 bg-white/5 rounded-2xl flex justify-between items-center text-sm">
                    <div><p className="font-bold text-white">{d.name}</p><p className="text-zinc-500">Primary: {d.p}</p></div>
                    <span className="text-rose-400 font-mono">Secondary: {d.s}</span>
                </div>
            ))}
        </div>
    );
};

const PublicNTPList = () => {
    const servers = ['pool.ntp.org', 'time.google.com', 'time.apple.com', 'ntp.aliyun.com'];
    return (
        <div className="space-y-2">
            {servers.map(s => (
                <div key={s} className="p-3 bg-white/5 rounded-xl flex justify-between items-center font-mono text-sm">
                    <span className="text-white">{s}</span>
                    <CopyButton text={s} />
                </div>
            ))}
        </div>
    );
};

const TLDSuffixes = () => {
    const tlds = [{ s: '.com', d: '商业' }, { s: '.org', d: '组织' }, { s: '.net', d: '网络' }, { s: '.cn', d: '中国' }, { s: '.io', d: '科技' }, { s: '.me', d: '个人' }];
    return (
        <div className="grid grid-cols-2 gap-2 text-sm">
            {tlds.map(t => (<div key={t.s} className="p-3 bg-white/5 rounded-xl"><p className="font-bold text-rose-500">{t.s}</p><p className="text-zinc-500">{t.d}</p></div>))}
        </div>
    );
};

const DNSQuery = () => {
    const [results] = useState([{ type: 'A', value: '104.21.78.23' }, { type: 'MX', value: 'mail.boxfoonk.com' }]);
    const [domain, setDomain] = useState('boxfoonk.com');
    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="domain.com" className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-white" />
                <button className="px-4 py-2 bg-rose-500 rounded-xl font-bold">查询</button>
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-[10px] text-amber-400 font-bold uppercase mb-1">注意</p>
                <p className="text-[10px] text-amber-500/80 leading-relaxed">纯前端环境不支持原生 DNS 协议查询。以下为示例结果，如需获取实时记录请点击下方跳转。</p>
            </div>
            <div className="space-y-2">{results.map((r, i) => (<div key={i} className="flex justify-between p-3 bg-white/5 rounded-xl text-xs font-mono"><span className="text-rose-400 font-bold">{r.type}</span><span className="text-zinc-400">{r.value}</span></div>))}</div>
            <a href={`https://www.itdog.cn/dns/${domain}`} target="_blank" rel="noreferrer" className="block text-center text-xs text-rose-400 hover:underline">去 ITDOG 查询实时解析</a>
        </div>
    );
};

const WorldTime = () => {
  const [times] = useState([{ city: '北京', tz: 'Asia/Shanghai' }, { city: '东京', tz: 'Asia/Tokyo' }, { city: '伦敦', tz: 'Europe/London' }, { city: '纽约', tz: 'America/New_York' }]);
  return (
    <div className="space-y-2">
      {times.map(t => (
        <div key={t.city} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
          <span className="font-bold text-white">{t.city}</span>
          <span className="text-xl font-mono text-rose-500">{format(new Date(new Date().toLocaleString('en-US', { timeZone: t.tz })), 'HH:mm:ss')}</span>
        </div>
      ))}
    </div>
  );
};

const MACVendor = () => {
    const [mac, setMac] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const lookup = () => {
        if (!mac) return;
        // Simple demo logic or placeholder
        if (mac.toUpperCase().startsWith('00:0C:29')) setResult('VMware, Inc.');
        else if (mac.toUpperCase().startsWith('B0:D5:9D')) setResult('Apple, Inc.');
        else setResult('未知厂商 (示例: 00:0C:29)');
    };
    return (
        <div className="space-y-4">
            <input 
                placeholder="输入 MAC 地址 (如 00:0C:29)" 
                value={mac}
                onChange={e => setMac(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white" 
            />
            <button onClick={lookup} className="w-full py-2 bg-rose-500 rounded-xl font-bold">查询厂商</button>
            {result && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <p className="text-xs text-green-400 uppercase font-bold mb-1">查询结果</p>
                    <p className="text-white font-bold">{result}</p>
                </div>
            )}
        </div>
    );
};

const IPInfo = () => {
    const [info, setInfo] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchIP = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            setInfo(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchIP(); }, []);

    return (
        <div className="space-y-4">
            <button onClick={fetchIP} disabled={loading} className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> 刷新信息
            </button>
            {info ? (
                <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-zinc-500">当前 IP</span>
                        <span className="text-rose-400 font-mono font-bold">{info.ip}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-zinc-500">地理位置</span>
                        <span className="text-white">{info.city}, {info.region}, {info.country_name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-zinc-500">运营商</span>
                        <span className="text-white text-xs text-right max-w-[200px]">{info.org || '未知'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-500">经纬度</span>
                        <span className="text-zinc-400 text-xs font-mono">{info.latitude}, {info.longitude}</span>
                    </div>
                </div>
            ) : (
                <div className="p-12 text-center text-zinc-500 text-sm">正在加载环境信息...</div>
            )}
        </div>
    );
};

const NetworkDiagnostic = () => {
    const [status, setStatus] = useState<any>({});
    const [testing, setTesting] = useState(false);

    const runTest = async () => {
        setTesting(true);
        const results: any = {
            online: navigator.onLine ? '在线' : '离线',
            platform: navigator.platform,
            userAgent: navigator.userAgent.includes('Cloudflare') ? '疑似 Cloudflare 代理' : '普通浏览器',
            language: navigator.language,
        };

        // Test latency to common services
        const start = Date.now();
        try {
            await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' });
            results.googleLatency = (Date.now() - start) + 'ms';
        } catch { results.googleLatency = '超时'; }

        const startB = Date.now();
        try {
            await fetch('https://www.baidu.com/favicon.ico', { mode: 'no-cors' });
            results.baiduLatency = (Date.now() - startB) + 'ms';
        } catch { results.baiduLatency = '超时'; }

        setStatus(results);
        setTesting(false);
    };

    useEffect(() => { runTest(); }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">网络状态</p>
                    <p className={cn("text-lg font-black", status.online === '在线' ? "text-green-500" : "text-red-500 text-sm")}>{status.online || '检测中'}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Google 延迟</p>
                    <p className="text-lg font-black text-white">{status.googleLatency || '--'}</p>
                </div>
            </div>
            
            <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">系统详情</h4>
                <div className="space-y-2 text-xs">
                    <p className="flex justify-between"><span className="text-zinc-600">平台</span><span className="text-zinc-400">{status.platform}</span></p>
                    <p className="flex justify-between"><span className="text-zinc-600">默认语言</span><span className="text-zinc-400">{status.language}</span></p>
                    <p className="flex justify-between"><span className="text-zinc-600">环境识别</span><span className="text-zinc-400">{status.userAgent}</span></p>
                </div>
            </div>

            <button 
                onClick={runTest} 
                disabled={testing}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
                {testing ? <><RefreshCw className="animate-spin" size={18} /> 诊断中...</> : '重新开始诊断'}
            </button>
        </div>
    );
};

const ExchangeRate = () => {
    const [amount, setAmount] = useState(1);
    const [rates, setRates] = useState<any>({ 'USD': 0.138, 'EUR': 0.127, 'JPY': 21.6, 'HKD': 1.08 });
    const [loading, setLoading] = useState(false);

    const updateRates = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://api.exchangerate-api.com/v4/latest/CNY');
            const data = await res.json();
            setRates(data.rates);
        } catch (e) {
            console.error('Fetch rate error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { updateRates(); }, []);

    return (
        <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">人民币金额 (CNY)</label>
                    <button onClick={updateRates} className="text-[10px] text-rose-400 hover:underline flex items-center gap-1">
                        <RefreshCw size={10} className={loading ? "animate-spin" : ""} /> 获取实时汇率
                    </button>
                </div>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-rose-500">¥</span>
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={e => setAmount(Number(e.target.value))} 
                        className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-2xl font-black text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['USD', 'EUR', 'JPY', 'HKD'].map(cur => (
                    <div key={cur} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center group hover:border-rose-500/30 transition-all">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">{cur}</p>
                        <p className="text-lg font-bold text-white">{(amount * (rates[cur] || 0)).toFixed(2)}</p>
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-zinc-600 text-center">汇率数据来自 Open API，仅供参考</p>
        </div>
    );
};

const CNHRate = () => {
  return (
    <div className="p-6 bg-rose-500/10 rounded-3xl text-center border border-rose-500/10">
      <p className="text-xs text-rose-400 uppercase font-bold mb-1">CNH (USD/CNH)</p>
      <p className="text-3xl font-black text-white">7.2482</p>
      <p className="text-green-400 text-xs mt-1">+0.012%</p>
    </div>
  );
};
