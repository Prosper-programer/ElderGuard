const fs = require('fs');
let text = fs.readFileSync('app/(parent)/health/index.tsx', 'utf8');

const oldHeaderRegex = /\{\/\* -- 1\. Premium Dark Hero Header -- \*\/\}[\s\S]*?(?=\{\/\* -- 2\. Responsive Vitals List)/;
const newHeader = \{/* -- 1. Seamless White Header (Design A) -- */}
      <View style={styles.whiteHeroHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(parent)' as any))}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={Colors.textPrimary || '#1F2937'} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.heroContent}>
          <Text style={styles.heroSubtitle}>Health Summary</Text>
          <View style={styles.heroStatusRow}>
            <Text style={styles.heroStatusText}>
              {vitals?.overallStatus === 'critical' ? 'Needs Attention' : 'Safe & Stable'}
            </Text>
            <View style={[styles.statusDotSmall, { backgroundColor: getStatusColor(vitals?.overallStatus || 'safe') }]} />
          </View>
          <Text style={styles.heroUpdateText}>
            {vitals?.overallStatus === 'offline' ? 'Last known data' : 'Updated ' + (vitals?.lastSyncTime || 'recently')}
          </Text>
        </View>
        
        <View style={styles.periodSwitcher}>
          {['24h', '7d', '30d'].map((p) => {
            const active = period === p;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPeriod(p as any)}
                style={[styles.periodBtn, active && styles.periodBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.periodBtnText, active && styles.periodBtnTextActive]}>
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      \;

text = text.replace(oldHeaderRegex, newHeader);

// Replace styles
text = text.replace(/darkHeroHeader: \{[\s\S]*?elevation: 8,\s*\},/m, 
\whiteHeroHeader: {
    backgroundColor: 'transparent',
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },\);

text = text.replace(/heroSubtitle: \{[\s\S]*?marginBottom: 4,\s*\},/m, 
\heroSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },\);

text = text.replace(/heroStatusText: \{[\s\S]*?letterSpacing: -0\.5,\s*\},/m, 
\heroStatusText: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },\);

text = text.replace(/heroUpdateText: \{[\s\S]*?color: 'rgba\(255, 255, 255, 0\.6\)',\s*\},/m, 
\heroUpdateText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  },\);

text = text.replace(/heroContent: \{[\s\S]*?marginVertical: Spacing\.md,\s*\},/m, 
\heroContent: {
    alignItems: 'flex-start',
    marginVertical: Spacing.md,
    paddingHorizontal: 4,
  },\);

// Update Back Button style to be transparent
text = text.replace(/backBtn: \{[\s\S]*?backgroundColor: 'rgba\(255,255,255,0\.1\)'[\s\S]*?\},/m, 
\ackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },\);

// Update the Period Switcher to be light grey
text = text.replace(/periodSwitcher: \{[\s\S]*?backgroundColor: 'rgba\(255,255,255,0\.1\)'[\s\S]*?\},/m, 
\periodSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    alignSelf: 'stretch',
    borderRadius: 12,
    padding: 4,
    marginTop: 20,
  },\);

text = text.replace(/periodBtnText: \{[\s\S]*?color: 'rgba\(255,255,255,0\.6\)'[\s\S]*?\},/m, 
\periodBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },\);

text = text.replace(/periodBtnTextActive: \{[\s\S]*?color: Colors\.white,[\s\S]*?\},/m, 
\periodBtnTextActive: {
    color: Colors.white,
  },\);

// Fix the active button shadow color
text = text.replace(/periodBtnActive: \{[\s\S]*?shadowColor: '#000',[\s\S]*?\},/m, 
\periodBtnActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },\);

fs.writeFileSync('app/(parent)/health/index.tsx', text, 'utf8');
