import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { getFbp, getFbc, trackBrowserPixel } from "@/lib/facebookTracking";

export default function CAPIDebug() {
  const [logs, setLogs] = useState<string[]>([]);
  const [fbpCookie, setFbpCookie] = useState<string>('');
  const [fbcCookie, setFbcCookie] = useState<string>('');
  const [allCookies, setAllCookies] = useState<string>('');

  const trackServerEvent = trpc.facebook.trackEvent.useMutation();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[CAPI Debug] ${message}`);
  };

  useEffect(() => {
    addLog('🚀 Página de diagnóstico carregada');
    
    // Check cookies
    const fbp = getFbp();
    const fbc = getFbc();
    
    setFbpCookie(fbp || 'NOT FOUND');
    setFbcCookie(fbc || 'NOT FOUND');
    setAllCookies(document.cookie || 'NO COOKIES');
    
    addLog(`Cookie _fbp: ${fbp || 'NOT FOUND'}`);
    addLog(`Cookie _fbc: ${fbc || 'NOT FOUND'}`);
    
    // Check if Facebook Pixel is loaded
    if (typeof window.fbq !== 'undefined') {
      addLog('✅ Facebook Pixel (fbq) está carregado');
    } else {
      addLog('❌ Facebook Pixel (fbq) NÃO está carregado');
    }
    
    // Check tRPC client
    if (trpc) {
      addLog('✅ tRPC client está disponível');
    } else {
      addLog('❌ tRPC client NÃO está disponível');
    }
  }, []);

  const testBrowserPixel = () => {
    addLog('🔵 Testando Browser Pixel...');
    try {
      trackBrowserPixel('ViewContent', {
        content_name: 'Debug Test',
        content_type: 'test'
      });
      addLog('✅ Browser Pixel disparado com sucesso');
    } catch (error) {
      addLog(`❌ Erro no Browser Pixel: ${error}`);
    }
  };

  const testServerCAPI = async () => {
    addLog('🟢 Testando Server CAPI...');
    
    try {
      const result = await trackServerEvent.mutateAsync({
        eventName: 'ViewContent',
        eventSourceUrl: window.location.href,
        fbp: getFbp(),
        fbc: getFbc(),
        customData: {
          content_name: 'Debug Test CAPI',
          content_type: 'test'
        }
      });
      
      addLog(`✅ Server CAPI respondeu: ${JSON.stringify(result)}`);
    } catch (error: any) {
      addLog(`❌ Erro no Server CAPI: ${error.message || error}`);
      console.error('CAPI Error:', error);
    }
  };

  const testDualTracking = async () => {
    addLog('🔷 Testando Dual Tracking (Pixel + CAPI)...');
    
    // 1. Browser Pixel
    try {
      trackBrowserPixel('InitiateCheckout', {
        content_name: 'Dual Test',
        currency: 'USD',
        value: 99,
        num_items: 1,
        content_type: 'product'
      });
      addLog('✅ Browser Pixel: InitiateCheckout disparado');
    } catch (error) {
      addLog(`❌ Browser Pixel falhou: ${error}`);
    }
    
    // 2. Server CAPI
    try {
      const result = await trackServerEvent.mutateAsync({
        eventName: 'InitiateCheckout',
        eventSourceUrl: window.location.href,
        fbp: getFbp(),
        fbc: getFbc(),
        customData: {
          content_name: 'Dual Test',
          currency: 'USD',
          value: 99,
          num_items: 1,
          content_type: 'product'
        }
      });
      addLog(`✅ Server CAPI: InitiateCheckout respondeu: ${JSON.stringify(result)}`);
    } catch (error: any) {
      addLog(`❌ Server CAPI falhou: ${error.message || error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('🧹 Logs limpos');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔍 Facebook CAPI Debug Console</h1>
        
        {/* Cookie Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 Status dos Cookies</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <span className="font-bold">_fbp:</span> 
              <span className={fbpCookie === 'NOT FOUND' ? 'text-red-600' : 'text-green-600'}>
                {' '}{fbpCookie}
              </span>
            </div>
            <div>
              <span className="font-bold">_fbc:</span> 
              <span className={fbcCookie === 'NOT FOUND' ? 'text-red-600' : 'text-green-600'}>
                {' '}{fbcCookie}
              </span>
            </div>
            <div className="mt-4">
              <span className="font-bold">Todos os cookies:</span>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-x-auto">
                {allCookies}
              </pre>
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🧪 Testes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={testBrowserPixel}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              🔵 Testar Browser Pixel
            </button>
            
            <button
              onClick={testServerCAPI}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              🟢 Testar Server CAPI
            </button>
            
            <button
              onClick={testDualTracking}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              🔷 Testar Dual Tracking
            </button>
          </div>
        </div>

        {/* Logs Console */}
        <div className="bg-black rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">📝 Console de Logs</h2>
            <button
              onClick={clearLogs}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded transition"
            >
              🧹 Limpar
            </button>
          </div>
          
          <div className="bg-gray-900 rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-gray-500">Aguardando logs...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-green-400 mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mt-6">
          <h3 className="font-bold text-yellow-800 mb-2">📌 Instruções</h3>
          <ol className="list-decimal list-inside space-y-1 text-yellow-700 text-sm">
            <li>Verifique se os cookies _fbp e _fbc estão presentes</li>
            <li>Teste o Browser Pixel primeiro (deve funcionar imediatamente)</li>
            <li>Teste o Server CAPI (deve retornar success: true)</li>
            <li>Teste o Dual Tracking para verificar ambos juntos</li>
            <li>Abra o DevTools (F12) e vá em Network para ver as requisições</li>
            <li>Abra o DevTools Console para ver logs detalhados</li>
          </ol>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:underline">
            ← Voltar para a página principal
          </a>
        </div>
      </div>
    </div>
  );
}
