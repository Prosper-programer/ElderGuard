const fs = require('fs');
let text = fs.readFileSync('app/(parent)/health/index.tsx', 'utf8');

const oldHeaderRegex = /\{\/\* -- 1\. Premium Dark Hero Header -- \*\/\}[\s\S]*?(?=\{\/\* -- 2\. Responsive Vitals List)/;
const newHeader = "{/* -- 1. Seamless White Header (Design A) -- */}\n" +
"      <View style={styles.whiteHeroHeader}>\n" +
"        <View style={styles.headerRow}>\n" +
"          <TouchableOpacity\n" +
"            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(parent)'))}\n" +
"            style={styles.backBtn}\n" +
"            activeOpacity={0.7}\n" +
"          >\n" +
"            <ChevronLeft size={24} color={Colors.textPrimary || '#1F2937'} />\n" +
"          </TouchableOpacity>\n" +
"        </View>\n" +
"        \n" +
"        <View style={styles.heroContent}>\n" +
"          <Text style={styles.heroSubtitle}>Health Summary</Text>\n" +
"          <View style={styles.heroStatusRow}>\n" +
"            <Text style={styles.heroStatusText}>\n" +
"              {vitals?.overallStatus === 'critical' ? 'Needs Attention' : 'Safe & Stable'}\n" +
"            </Text>\n" +
"            <View style={[styles.statusDotSmall, { backgroundColor: getStatusColor(vitals?.overallStatus || 'safe') }]} />\n" +
"          </View>\n" +
"          <Text style={styles.heroUpdateText}>\n" +
"            {vitals?.overallStatus === 'offline' ? 'Last known data' : 'Updated ' + (vitals?.lastSyncTime || 'recently')}\n" +
"          </Text>\n" +
"        </View>\n" +
"        \n" +
"        <View style={styles.periodSwitcher}>\n" +
"          {['24h', '7d', '30d'].map((p) => {\n" +
"            const active = period === p;\n" +
"            return (\n" +
"              <TouchableOpacity\n" +
"                key={p}\n" +
"                onPress={() => setPeriod(p)}\n" +
"                style={[styles.periodBtn, active && styles.periodBtnActive]}\n" +
"                activeOpacity={0.8}\n" +
"              >\n" +
"                <Text style={[styles.periodBtnText, active && styles.periodBtnTextActive]}>\n" +
"                  {p}\n" +
"                </Text>\n" +
"              </TouchableOpacity>\n" +
"            );\n" +
"          })}\n" +
"        </View>\n" +
"      </View>\n\n      ";

text = text.replace(oldHeaderRegex, newHeader);

// Replace styles
text = text.replace(/darkHeroHeader: \{[\s\S]*?elevation: 8,\s*\},/m, 
"whiteHeroHeader: {\n" +
"    backgroundColor: 'transparent',\n" +
"    padding: Spacing.md,\n" +
"    marginBottom: Spacing.lg,\n" +
"  },");

text = text.replace(/heroSubtitle: \{[\s\S]*?marginBottom: 4,\s*\},/m, 
"heroSubtitle: {\n" +
"    fontSize: 14,\n" +
"    color: Colors.textSecondary,\n" +
"    fontWeight: '700',\n" +
"    textTransform: 'uppercase',\n" +
"    letterSpacing: 1,\n" +
"    marginBottom: 4,\n" +
"  },");

text = text.replace(/heroStatusText: \{[\s\S]*?letterSpacing: -0\.5,\s*\},/m, 
"heroStatusText: {\n" +
"    fontSize: 34,\n" +
"    fontWeight: '800',\n" +
"    color: Colors.textPrimary,\n" +
"    letterSpacing: -1,\n" +
"  },");

text = text.replace(/heroUpdateText: \{[\s\S]*?color: 'rgba\(255, 255, 255, 0\.6\)',\s*\},/m, 
"heroUpdateText: {\n" +
"    fontSize: 13,\n" +
"    color: Colors.textSecondary,\n" +
"    fontWeight: '500',\n" +
"    marginTop: 4,\n" +
"  },");

text = text.replace(/heroContent: \{[\s\S]*?marginVertical: Spacing\.md,\s*\},/m, 
"heroContent: {\n" +
"    alignItems: 'flex-start',\n" +
"    marginVertical: Spacing.md,\n" +
"    paddingHorizontal: 4,\n" +
"  },");

// Update Back Button style to be transparent
text = text.replace(/backBtn: \{[\s\S]*?backgroundColor: 'rgba\(255,255,255,0\.1\)'[\s\S]*?\},/m, 
"backBtn: {\n" +
"    width: 44,\n" +
"    height: 44,\n" +
"    borderRadius: 22,\n" +
"    backgroundColor: '#F3F4F6',\n" +
"    alignItems: 'center',\n" +
"    justifyContent: 'center',\n" +
"  },");

// Update the Period Switcher to be light grey
text = text.replace(/periodSwitcher: \{[\s\S]*?backgroundColor: 'rgba\(255,255,255,0\.1\)'[\s\S]*?\},/m, 
"periodSwitcher: {\n" +
"    flexDirection: 'row',\n" +
"    backgroundColor: '#F3F4F6',\n" +
"    alignSelf: 'stretch',\n" +
"    borderRadius: 12,\n" +
"    padding: 4,\n" +
"    marginTop: 20,\n" +
"  },");

text = text.replace(/periodBtnText: \{[\s\S]*?color: 'rgba\(255,255,255,0\.6\)'[\s\S]*?\},/m, 
"periodBtnText: {\n" +
"    fontSize: 14,\n" +
"    fontWeight: '600',\n" +
"    color: '#6B7280',\n" +
"  },");

text = text.replace(/periodBtnTextActive: \{[\s\S]*?color: Colors\.white,[\s\S]*?\},/m, 
"periodBtnTextActive: {\n" +
"    color: Colors.white,\n" +
"  },");

// Fix the active button shadow color
text = text.replace(/periodBtnActive: \{[\s\S]*?shadowColor: '#000',[\s\S]*?\},/m, 
"periodBtnActive: {\n" +
"    backgroundColor: Colors.primary,\n" +
"    shadowColor: Colors.primary,\n" +
"    shadowOffset: { width: 0, height: 2 },\n" +
"    shadowOpacity: 0.2,\n" +
"    shadowRadius: 4,\n" +
"    elevation: 2,\n" +
"  },");

fs.writeFileSync('app/(parent)/health/index.tsx', text, 'utf8');
