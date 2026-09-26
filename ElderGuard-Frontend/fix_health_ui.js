const fs = require('fs');
let text = fs.readFileSync('app/(parent)/health/index.tsx', 'utf8');

const regex = /\{\/\* -- 1\. Header with Inline Period Switcher -- \*\/\}.*?(?=\{\/\* -- 3\. Heart Rate Detailed)/s;

const newContent = "{/* -- 1. Premium Dark Hero Header -- */}\n" +
"        <View style={styles.darkHeroHeader}>\n" +
"          <View style={styles.headerRow}>\n" +
"            <TouchableOpacity\n" +
"              onPress={() => (router.canGoBack() ? router.back() : router.replace('/(parent)'))}\n" +
"              style={styles.backBtn}\n" +
"              activeOpacity={0.7}\n" +
"            >\n" +
"              <ChevronLeft size={20} color={Colors.white} />\n" +
"            </TouchableOpacity>\n" +
"    \n" +
"            <Text style={styles.screenTitle}>Health Report</Text>\n" +
"    \n" +
"            <View style={{ width: 38 }} /> \n" +
"          </View>\n" +
"          \n" +
"          <View style={styles.heroContent}>\n" +
"            <Text style={styles.heroSubtitle}>Overall Health</Text>\n" +
"            <View style={styles.heroStatusRow}>\n" +
"              <Text style={styles.heroStatusText}>\n" +
"                {vitals?.overallStatus === 'critical' ? 'Needs Attention' : 'Safe & Stable'}\n" +
"              </Text>\n" +
"              <View style={[styles.statusDotSmall, { backgroundColor: getStatusColor(vitals?.overallStatus || 'safe') }]} />\n" +
"            </View>\n" +
"            <Text style={styles.heroUpdateText}>\n" +
"              {vitals?.overallStatus === 'offline' ? 'Last known data' : 'Updated ' + (vitals?.lastSyncTime || 'recently')}\n" +
"            </Text>\n" +
"          </View>\n" +
"          \n" +
"          <View style={styles.periodSwitcher}>\n" +
"            {['24h', '7d', '30d'].map((p) => {\n" +
"              const active = period === p;\n" +
"              return (\n" +
"                <TouchableOpacity\n" +
"                  key={p}\n" +
"                  onPress={() => setPeriod(p)}\n" +
"                  style={[styles.periodBtn, active && styles.periodBtnActive]}\n" +
"                  activeOpacity={0.8}\n" +
"                >\n" +
"                  <Text style={[styles.periodBtnText, active && styles.periodBtnTextActive]}>\n" +
"                    {p}\n" +
"                  </Text>\n" +
"                </TouchableOpacity>\n" +
"              );\n" +
"            })}\n" +
"          </View>\n" +
"        </View>\n" +
"\n" +
"        {/* -- 2. Responsive Vitals List (Matching Dashboard) -- */}\n" +
"        <View style={styles.vitalsListContainer}>\n" +
"          <Text style={styles.sectionOverline}>CURRENT VITALS</Text>\n" +
"          <Card style={styles.healthListCard}>\n" +
"            {vitals?.heartRate && (\n" +
"              <View style={[styles.healthRow, styles.itemBorderBottom]}>\n" +
"                <View style={[styles.healthIconWrap, { backgroundColor: Colors.criticalBg || 'rgba(239, 68, 68, 0.1)' }]}>\n" +
"                  <Heart size={18} color={Colors.critical || '#EF4444'} />\n" +
"                </View>\n" +
"                <Text style={styles.healthRowTitle}>{vitals.heartRate.label || 'Heart Rate'}</Text>\n" +
"                <View style={styles.healthRowRight}>\n" +
"                  <Text style={styles.healthRowValue}>{vitals.heartRate.value} <Text style={styles.healthRowUnit}>{vitals.heartRate.unit}</Text></Text>\n" +
"                  <Text style={[styles.healthRowStatus, { color: getStatusColor(vitals.heartRate.status) }]}>{vitals.heartRate.statusLabel}</Text>\n" +
"                </View>\n" +
"              </View>\n" +
"            )}\n" +
"\n" +
"            {vitals?.spo2 && (\n" +
"              <View style={[styles.healthRow, styles.itemBorderBottom]}>\n" +
"                <View style={[styles.healthIconWrap, { backgroundColor: Colors.primaryFaded || 'rgba(60, 111, 219, 0.1)' }]}>\n" +
"                  <Activity size={18} color={Colors.primary || '#3C6FDB'} />\n" +
"                </View>\n" +
"                <Text style={styles.healthRowTitle}>{vitals.spo2.label || 'Blood Oxygen'}</Text>\n" +
"                <View style={styles.healthRowRight}>\n" +
"                  <Text style={styles.healthRowValue}>{vitals.spo2.value} <Text style={styles.healthRowUnit}>{vitals.spo2.unit}</Text></Text>\n" +
"                  <Text style={[styles.healthRowStatus, { color: getStatusColor(vitals.spo2.status) }]}>{vitals.spo2.statusLabel}</Text>\n" +
"                </View>\n" +
"              </View>\n" +
"            )}\n" +
"\n" +
"            {vitals?.temperature && (\n" +
"              <View style={[styles.healthRow, styles.itemBorderBottom]}>\n" +
"                <View style={[styles.healthIconWrap, { backgroundColor: Colors.warningBg || 'rgba(245, 158, 11, 0.1)' }]}>\n" +
"                  <Thermometer size={18} color={Colors.warning || '#F59E0B'} />\n" +
"                </View>\n" +
"                <Text style={styles.healthRowTitle}>{vitals.temperature.label || 'Body Temp'}</Text>\n" +
"                <View style={styles.healthRowRight}>\n" +
"                  <Text style={styles.healthRowValue}>{vitals.temperature.value} <Text style={styles.healthRowUnit}>{vitals.temperature.unit}</Text></Text>\n" +
"                  <Text style={[styles.healthRowStatus, { color: getStatusColor(vitals.temperature.status) }]}>{vitals.temperature.statusLabel}</Text>\n" +
"                </View>\n" +
"              </View>\n" +
"            )}\n" +
"          </Card>\n" +
"        </View>\n" +
"\n        ";

text = text.replace(regex, newContent);

// Add styles
const newStyles = 
"  darkHeroHeader: {\n" +
"    backgroundColor: '#1E293B',\n" +
"    borderRadius: BorderRadius.lg,\n" +
"    padding: Spacing.lg,\n" +
"    marginBottom: Spacing.xl,\n" +
"    shadowColor: Colors.primary,\n" +
"    shadowOffset: { width: 0, height: 12 },\n" +
"    shadowOpacity: 0.2,\n" +
"    shadowRadius: 30,\n" +
"    elevation: 8,\n" +
"  },\n" +
"  heroContent: {\n" +
"    alignItems: 'center',\n" +
"    marginVertical: Spacing.md,\n" +
"  },\n" +
"  heroSubtitle: {\n" +
"    fontSize: 14,\n" +
"    color: 'rgba(255, 255, 255, 0.7)',\n" +
"    fontWeight: '600',\n" +
"    marginBottom: 4,\n" +
"  },\n" +
"  heroStatusRow: {\n" +
"    flexDirection: 'row',\n" +
"    alignItems: 'center',\n" +
"    gap: 8,\n" +
"    marginBottom: 4,\n" +
"  },\n" +
"  heroStatusText: {\n" +
"    fontSize: 28,\n" +
"    fontWeight: '800',\n" +
"    color: Colors.white,\n" +
"    letterSpacing: -0.5,\n" +
"  },\n" +
"  statusDotSmall: {\n" +
"    width: 8,\n" +
"    height: 8,\n" +
"    borderRadius: 4,\n" +
"  },\n" +
"  heroUpdateText: {\n" +
"    fontSize: 12,\n" +
"    color: 'rgba(255, 255, 255, 0.6)',\n" +
"  },\n" +
"  vitalsListContainer: {\n" +
"    marginBottom: Spacing.xl,\n" +
"  },\n" +
"  sectionOverline: {\n" +
"    fontSize: 12,\n" +
"    fontWeight: '800',\n" +
"    color: Colors.primary,\n" +
"    marginBottom: 12,\n" +
"    marginLeft: 4,\n" +
"    letterSpacing: 0.5,\n" +
"  },\n" +
"  healthListCard: {\n" +
"    backgroundColor: Colors.white,\n" +
"    borderRadius: BorderRadius.lg,\n" +
"    borderWidth: 1,\n" +
"    borderColor: Colors.borderLight,\n" +
"    shadowColor: Colors.primary,\n" +
"    shadowOpacity: 0.04,\n" +
"    shadowRadius: 15,\n" +
"    elevation: 2,\n" +
"    overflow: 'hidden',\n" +
"  },\n" +
"  healthRow: {\n" +
"    flexDirection: 'row',\n" +
"    alignItems: 'center',\n" +
"    paddingVertical: 14,\n" +
"    paddingHorizontal: 16,\n" +
"  },\n" +
"  itemBorderBottom: {\n" +
"    borderBottomWidth: 1,\n" +
"    borderBottomColor: Colors.borderLight,\n" +
"  },\n" +
"  healthIconWrap: {\n" +
"    width: 32,\n" +
"    height: 32,\n" +
"    borderRadius: 8,\n" +
"    alignItems: 'center',\n" +
"    justifyContent: 'center',\n" +
"    marginRight: 12,\n" +
"  },\n" +
"  healthRowTitle: {\n" +
"    flex: 1,\n" +
"    fontSize: 15,\n" +
"    fontWeight: '600',\n" +
"    color: Colors.textPrimary,\n" +
"  },\n" +
"  healthRowRight: {\n" +
"    alignItems: 'flex-end',\n" +
"  },\n" +
"  healthRowValue: {\n" +
"    fontSize: 16,\n" +
"    fontWeight: '700',\n" +
"    color: Colors.textPrimary,\n" +
"  },\n" +
"  healthRowUnit: {\n" +
"    fontSize: 12,\n" +
"    color: Colors.textSecondary,\n" +
"    fontWeight: '500',\n" +
"  },\n" +
"  healthRowStatus: {\n" +
"    fontSize: 11,\n" +
"    fontWeight: '600',\n" +
"    marginTop: 2,\n" +
"  },\n";

text = text.replace(/const styles = StyleSheet\.create\(\{/, 'const styles = StyleSheet.create({\n' + newStyles);

// Modify old header styles
text = text.replace(/screenTitle: \{\r?\n    fontSize: 20,\r?\n    fontWeight: '800',\r?\n    color: '#0F172A',/m, "screenTitle: { fontSize: 20, fontWeight: '800', color: Colors.white,");
text = text.replace(/backBtn: \{\r?\n    width: 38,\r?\n    height: 38,\r?\n    borderRadius: 12,\r?\n    backgroundColor: '#FFFFFF',\r?\n    borderWidth: 1,\r?\n    borderColor: '#E2E8F0',/m, "backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0,");

// Modify periodSwitcher to look good on dark
text = text.replace(/periodSwitcher: \{\r?\n    flexDirection: 'row',\r?\n    backgroundColor: '#E2E8F0',/m, "periodSwitcher: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'center',");
text = text.replace(/periodBtnActive: \{\r?\n    backgroundColor: '#FFFFFF',\r?\n    shadowColor: '#000',/m, "periodBtnActive: { backgroundColor: Colors.primary, shadowColor: '#000',");
text = text.replace(/periodBtnText: \{\r?\n    fontSize: 13,\r?\n    fontWeight: '600',\r?\n    color: '#64748B',/m, "periodBtnText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.6)',");
text = text.replace(/periodBtnTextActive: \{\r?\n    color: '#0F172A',/m, "periodBtnTextActive: { color: Colors.white,");

// Update all hardcoded chart blues/greens to Colors.primary / Brand colors
text = text.replace(/#2563EB/g, "'+Colors.primary+'"); 
text = text.replace(/'\+Colors\.primary\+'/g, "'+Colors.primary+'"); // Prevent double replace
text = text.replace(/#3B82F6/g, "'+Colors.primaryLight+'");
text = text.replace(/#60A5FA/g, "'+Colors.primaryLight+'");

// Fix any string quoting issues from previous replacement
text = text.replace(/fill="'\+Colors\.primary\+'"/g, 'fill={Colors.primary}');
text = text.replace(/fill="'\+Colors\.primaryLight\+'"/g, 'fill={Colors.primaryLight}');
text = text.replace(/stroke="'\+Colors\.primary\+'"/g, 'stroke={Colors.primary}');
text = text.replace(/stroke="'\+Colors\.primaryLight\+'"/g, 'stroke={Colors.primaryLight}');
text = text.replace(/stopColor="'\+Colors\.primary\+'"/g, 'stopColor={Colors.primary}');
text = text.replace(/stopColor="'\+Colors\.primaryLight\+'"/g, 'stopColor={Colors.primaryLight}');

// Clean up ScreenContainer background
text = text.replace(/backgroundColor="#F0F4FA"/, "");

fs.writeFileSync('app/(parent)/health/index.tsx', text, 'utf8');
