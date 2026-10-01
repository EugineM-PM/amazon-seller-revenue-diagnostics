import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini on the server side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback multilingual response generator if API key is absent or offline
function generateFallbackExplanation(language: string, context: any, question?: string) {
  const langKey = (language || 'english').toLowerCase();
  const product = context.productName || 'Overall Seller Catalog';
  const issue = context.primaryIssue || 'Price-driven Buy Box Loss';
  const revRisk = context.revenueAtRisk || 'AED 14,800';

  if (langKey.includes('telugu')) {
    return `నమస్కారం! మీ అమ్మకాల విశ్లేషణ ఇక్కడ ఉంది:
1. **ఏమి జరిగింది?**: ${product} లో రెవెన్యూ సుమారు ${context.revenueChange || '-12%'} తగ్గింది. రిస్క్ లో ఉన్న మొత్తం: ${revRisk}.
2. **ఎందుకు జరిగింది?**: ప్రధాన కారణం: "${issue}". పోటీదారులు ధరను తగ్గించడంతో మీ బై బాక్స్ (Buy Box) శాతం తగ్గింది.
3. **మీరు చేయవలసిన తక్షణ చర్యలు**:
   • ఆటోమేటెడ్ రీప్రైసింగ్ రూల్స్ సెట్ చేయండి (కనిష్ట లాభ మార్జిన్ కాపాడుకుంటూ).
   • 30 రోజుల కన్నా తక్కువ ఉన్న ఇన్వెంటరీని రీస్టాక్ చేయండి.
   • 'Amazon Brand Registry' ద్వారా నకిలీ లిస్టింగ్‌లను రిపోర్ట్ చేయండి.`;
  } else if (langKey.includes('tamil')) {
    return `வணக்கம்! உங்கள் விற்பனை அறிக்கை சுருக்கம்:
1. **என்ன நடந்தது?**: ${product} தயாரிப்பின் வருவாய் ${context.revenueChange || '-12%'} குறைந்துள்ளது. ஆபத்தில் உள்ள தொகை: ${revRisk}.
2. **ஏன் நடந்தது?**: முக்கிய காரணம்: "${issue}". போட்டியாளர்களின் விலை குறைப்பால் உங்கள் Buy Box பங்கு சரிந்துள்ளது.
3. **அடுத்து செய்ய வேண்டிய முக்கிய நடவடிக்கைகள்**:
   • குறைந்தபட்ச லாபத்திற்கு ஏற்ப Repricing விதியை புதுப்பிக்கவும்.
   • ஸ்டாக் தீரும் முன் உடனே Amazon FBA விற்கு இன்வெண்டரி அனுப்பவும்.
   • குறைந்த ரேங்கிங் உள்ள தேடல் சொற்களுக்கு PPC விளம்பரங்களை இயக்கவும்.`;
  } else if (langKey.includes('hindi')) {
    return `नमस्ते! आपके सेलर परफॉरमेंस की त्वरित रिपोर्ट:
1. **क्या हुआ?**: ${product} का राजस्व ${context.revenueChange || '-12%'} गिरा है। जोखिम में राजस्व: ${revRisk}।
2. **यह क्यों हुआ?**: मुख्य कारण है: "${issue}"। प्रतियोगी के दाम घटाने से आपका Buy Box शेयर प्रभावित हुआ है।
3. **त्वरित सुझाव**:
   • प्राइस मैच या ऑटो-रीप्राइसर एक्टिवेट करें ताकि बाय बॉक्स वापस मिल सके।
   • कम इन्वेंट्री (DOC < 30 दिन) वाले प्रोडक्ट्स का तुरंत PO बनाएं।
   • डुप्लीकेट या हाइजैक्ड लिस्टिंग की शिकायत Amazon Brand Registry पर दर्ज करें।`;
  } else if (langKey.includes('malayalam')) {
    return `നമസ്കാരം! നിങ്ങളുടെ ആമസോൺ സെല്ലർ റിപ്പോർട്ട്:
1. **എന്ത് സംഭവിച്ചു?**: ${product} റവന്യൂ ${context.revenueChange || '-12%'} കുറഞ്ഞു. റിസ്കിലുള്ള വരുമാനം: ${revRisk}.
2. **എന്തുകൊണ്ട് സംഭവിച്ചു?**: പ്രധാന കാരണം: "${issue}". എതിരാളികളുടെ വിലക്കുറവ് നിങ്ങളുടെ Buy Box നഷ്ടപ്പെടുത്തി.
3. **ചെയ്യേണ്ട മുൻഗണനാ നടപടികൾ**:
   • പ്രൈസിംഗ് അൽഗോരിതം അപ്ഡേറ്റ് ചെയ്ത് ബൈ ബോക്സ് തിരിച്ചുപിടിക്കുക.
   • 30 ദിവസത്തിൽ താഴെ സ്റ്റോക്കുള്ള ഉൽപ്പന്നങ്ങൾ ഉടൻ റീസ്റ്റോക്ക് ചെയ്യുക.
   • സെർച്ച് വിസിബിലിറ്റി കൂട്ടാൻ പരസ്യ കാമ്പയിൻ ടാർഗറ്റ് ചെയ്യുക.`;
  } else if (langKey.includes('french')) {
    return `Bonjour ! Voici le diagnostic rapide de vos performances vendeur :
1. **Ce qui s'est passé** : Le revenu pour ${product} a baissé de ${context.revenueChange || '-12%'}, avec ${revRisk} à risque direct.
2. **Pourquoi c'est arrivé** : Cause racine identifiée : "${issue}". La perte de la Buy Box suite à un ajustement de prix concurrent a causé ce repli.
3. **Actions immédiates recommandées** :
   • Ajustez votre stratégie de repricing dynamique pour reconquérir la Buy Box.
   • Réapprovisionnez les références dont la couverture de stock (DOC) est inférieure à 30 jours.
   • Lancez des campagnes Sponsored Products sur les mots-clés à fort volume et faible rang.`;
  } else if (langKey.includes('spanish')) {
    return `¡Hola! Aquí está el diagnóstico clave de tu cuenta de vendedor:
1. **Qué ocurrió**: Los ingresos de ${product} cayeron un ${context.revenueChange || '-12%'}, con ${revRisk} en riesgo.
2. **Por qué ocurrió**: Causa principal: "${issue}". El recorte de precios del competidor provocó la pérdida de la Buy Box.
3. **Próximos pasos clave**:
   • Ajusta tu regla de repricing automático respetando tu margen mínimo.
   • Reabastece de inmediato el stock en riesgo de agotamiento (DOC < 30 días).
   • Optimiza los términos de búsqueda con alto volumen de impresiones y baja conversión.`;
  } else {
    return `Hello! Here is your proactive seller diagnostics breakdown:
1. **What happened**: Revenue on ${product} dropped ${context.revenueChange || '-12%'} vs previous period. Revenue at Risk is ${revRisk}.
2. **Why it happened**: Primary root cause: "${issue}". Competitor price undercut eroded Buy Box share from 82% to 59%, while search traffic remained steady.
3. **Immediate Recommended Next Steps**:
   • Activate Automated Match Lowest Price rule on Seller Central with a safe margin floor.
   • Expedite FBA inbound shipment for SKUs with Days of Cover (DOC) below 30 days.
   • Harvest high-volume search terms and reallocate PPC spend to defend rank.`;
  }
}

// API endpoint for AI Seller Advisor
app.post('/api/advisor/explain', async (req, res) => {
  try {
    const { language = 'English', sellerContext = {}, productContext = {}, question } = req.body;

    if (!ai) {
      const fallback = generateFallbackExplanation(language, { ...sellerContext, ...productContext }, question);
      return res.json({
        success: true,
        source: 'local_engine',
        language,
        explanation: fallback,
      });
    }

    const prompt = `You are Live Advisor Seller Genie, the friendly and sharp Amazon 3P Seller Analytics Mascot and Advisor. 
You are cheerful, sharp, empathetic, and expert at Amazon marketplace analytics.
You help sellers explain and understand reports, trends, and numbers in an easy, quick, and concise way.
The user is a small brand owner/seller. You must provide a concise, razor-sharp, actionable explanation in ${language}.

Seller Context:
- Overall Seller Health Score: ${sellerContext.healthScore ?? '78'}/100 (Change: ${sellerContext.scoreChange ?? '-8 pts'})
- Revenue: ${sellerContext.revenue ?? 'AED 125,000'} (Change: ${sellerContext.revenueChange ?? '-12%'})
- Revenue at Risk: ${sellerContext.revenueAtRisk ?? 'AED 14,800'}
- Drivers: Buy Box (${sellerContext.buyBoxChange ?? '-9 pts'}), Search Visibility (${sellerContext.searchChange ?? '-6 pts'}), Inventory (${sellerContext.inventoryChange ?? '+4 pts'}), Conversion (${sellerContext.convChange ?? '+2 pts'}), Pricing (${sellerContext.priceChange ?? '+1 pt'})

Product Context:
- Active Product: ${productContext.name || 'Sony WH-1000XM5 ANC Headphones'}
- Product Revenue: ${productContext.revenue || 'AED 32,000'} (${productContext.revenueChange || '↓ 18%'})
- Buy Box Status: ${productContext.buyBoxStatus || 'Dropped from 82% to 59%'}
- Competitor Price Action: ${productContext.competitorPrice || 'Competitor dropped from AED 1,199 to AED 1,099'}
- Search Visibility: ${productContext.searchVisibility || 'Stable (Rank #3)'}
- Conversion: ${productContext.conversionRate || 'Stable (9.4%)'}
- Inventory Status: ${productContext.inventoryStatus || 'Healthy (48 Days of Cover)'}
- Primary Root Cause Diagnosis: ${productContext.diagnosis || 'Price-driven Buy Box loss is the primary driver of revenue decline'}

User's Specific Query (if any): "${question || 'Explain what happened, why it happened, and what actions I should take today'}"

Guidelines for your response:
1. Reply STRICTLY in the requested language: ${language} (e.g. if Telugu, write natural Telugu; if Tamil, Tamil; if Hindi, Hindi; if Malayalam, Malayalam; if French, French; if Spanish, Spanish; if English, English).
2. Keep it under 140 words, broken down cleanly into:
   - 📊 **What happened** (concise numbers)
   - 🔍 **Why it happened** (root cause diagnosis)
   - ⚡ **What to do now** (2-3 concrete steps on Amazon Seller Central)
3. Tone: Empowering, clear, senior e-commerce consultant. No fluff, no jargon overload.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const text = response.text || generateFallbackExplanation(language, { ...sellerContext, ...productContext }, question);

    res.json({
      success: true,
      source: 'gemini',
      language,
      explanation: text,
    });
  } catch (error: any) {
    console.error('Advisor generation error:', error);
    const { language = 'English', sellerContext = {}, productContext = {}, question } = req.body;
    const fallback = generateFallbackExplanation(language, { ...sellerContext, ...productContext }, question);
    res.json({
      success: true,
      source: 'local_fallback',
      language,
      explanation: fallback,
      errorNotice: error?.message || 'Error executing AI model',
    });
  }
});

// Applet health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`AuraSeller server running on http://0.0.0.0:${port}`);
  });
}

startServer();
