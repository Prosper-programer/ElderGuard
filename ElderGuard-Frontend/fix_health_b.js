const fs = require('fs');
let text = fs.readFileSync('app/(parent)/health/index.tsx', 'utf8');

// Replace JSX
text = text.replace(/<View style=\{styles\.whiteHeroHeader\}>/g, "<View style={styles.softBlueHeroHeader}>");
text = text.replace(/<ChevronLeft size=\{24\} color=\{Colors\.textPrimary \|\| '#1F2937'\} \/>/g, "<ChevronLeft size={24} color={Colors.white} />");
text = text.replace(/\{\/\* -- 1\. Seamless White Header \(Design A\) -- \*\/\}/g, "{/* -- 1. Soft Blue Edge Header (Design B) -- */}");

// Replace styles
text = text.replace(/whiteHeroHeader: \{[\s\S]*?marginBottom: Spacing\.lg,\s*\}/, 
  "softBlueHeroHeader: {\n" +
  "    backgroundColor: Colors.primary,\n" +
  "    paddingTop: 30,\n" +
  "    paddingHorizontal: 20,\n" +
  "    paddingBottom: 24,\n" +
  "    marginHorizontal: -20,\n" +
  "    marginTop: -20,\n" +
  "    marginBottom: Spacing.lg,\n" +
  "  }");

text = text.replace(/heroSubtitle: \{[\s\S]*?marginBottom: 4,\s*\}/, 
  "heroSubtitle: {\n" +
  "    fontSize: 14,\n" +
  "    color: 'rgba(255,255,255,0.7)',\n" +
  "    fontWeight: '700',\n" +
  "    textTransform: 'uppercase',\n" +
  "    letterSpacing: 1,\n" +
  "    marginBottom: 4,\n" +
  "  }");

text = text.replace(/heroStatusText: \{[\s\S]*?letterSpacing: -1,\s*\}/, 
  "heroStatusText: {\n" +
  "    fontSize: 34,\n" +
  "    fontWeight: '800',\n" +
  "    color: Colors.white,\n" +
  "    letterSpacing: -1,\n" +
  "  }");

text = text.replace(/heroUpdateText: \{[\s\S]*?marginTop: 4,\s*\}/, 
  "heroUpdateText: {\n" +
  "    fontSize: 13,\n" +
  "    color: 'rgba(255,255,255,0.7)',\n" +
  "    fontWeight: '500',\n" +
  "    marginTop: 4,\n" +
  "  }");

text = text.replace(/backBtn: \{[\s\S]*?justifyContent: 'center',\s*\}/, 
  "backBtn: {\n" +
  "    width: 44,\n" +
  "    height: 44,\n" +
  "    borderRadius: 22,\n" +
  "    backgroundColor: 'rgba(255,255,255,0.15)',\n" +
  "    alignItems: 'center',\n" +
  "    justifyContent: 'center',\n" +
  "  }");

text = text.replace(/periodSwitcher: \{[\s\S]*?marginTop: 20,\s*\}/, 
  "periodSwitcher: {\n" +
  "    flexDirection: 'row',\n" +
  "    backgroundColor: 'rgba(255,255,255,0.15)',\n" +
  "    alignSelf: 'stretch',\n" +
  "    borderRadius: 12,\n" +
  "    padding: 4,\n" +
  "    marginTop: 20,\n" +
  "  }");

text = text.replace(/periodBtnText: \{[\s\S]*?color: '#6B7280',\s*\}/, 
  "periodBtnText: {\n" +
  "    fontSize: 14,\n" +
  "    fontWeight: '600',\n" +
  "    color: 'rgba(255,255,255,0.8)',\n" +
  "  }");

text = text.replace(/periodBtnTextActive: \{[\s\S]*?color: Colors\.white,\s*\}/, 
  "periodBtnTextActive: {\n" +
  "    color: Colors.primary,\n" +
  "  }");

text = text.replace(/periodBtnActive: \{[\s\S]*?elevation: 2,\s*\}/, 
  "periodBtnActive: {\n" +
  "    backgroundColor: Colors.white,\n" +
  "    shadowColor: '#000',\n" +
  "    shadowOffset: { width: 0, height: 2 },\n" +
  "    shadowOpacity: 0.1,\n" +
  "    shadowRadius: 4,\n" +
  "    elevation: 2,\n" +
  "  }");

fs.writeFileSync('app/(parent)/health/index.tsx', text, 'utf8');
