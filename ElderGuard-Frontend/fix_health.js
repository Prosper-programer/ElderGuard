const fs = require('fs');
let text = fs.readFileSync('app/(parent)/index.tsx', 'utf8');

// Replace the Health Overview section
const oldHealthSectionRegex = /\{\/\* 5\. HEALTH OVERVIEW \(Upgraded with Sparklines\) \*\/\}.*?\{\/\* 6\. TODAY'S CARE \*\/\}/s;

const newHealthSection = \{/* 5. HEALTH OVERVIEW (Clean Responsive List) */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>HEALTH OVERVIEW</Text>
          <TouchableOpacity onPress={() => router.push('/(parent)/health' as any)}>
            <Text style={styles.sectionActionText}>Full report {'>'}</Text>
          </TouchableOpacity>
        </View>
        
        <Card style={styles.healthListCard}>
          {vitals?.heartRate && (
            <View style={[styles.healthRow, styles.itemBorderBottom]}>
              <View style={[styles.healthIconWrap, { backgroundColor: Colors.criticalLight }]}>
                <Heart size={18} color={Colors.critical} />
              </View>
              <Text style={styles.healthRowTitle}>Heart Rate</Text>
              <View style={styles.healthRowRight}>
                <Text style={styles.healthRowValue}>{vitals.heartRate.value} <Text style={styles.healthRowUnit}>{vitals.heartRate.unit}</Text></Text>
                <Text style={[styles.healthRowStatus, { color: getStatusColor(vitals.heartRate.status as any) }]}>{vitals.heartRate.statusLabel}</Text>
              </View>
            </View>
          )}

          {vitals?.spo2 && (
            <View style={[styles.healthRow, styles.itemBorderBottom]}>
              <View style={[styles.healthIconWrap, { backgroundColor: Colors.primaryFaded }]}>
                <Activity size={18} color={Colors.primary} />
              </View>
              <Text style={styles.healthRowTitle}>Blood Oxygen</Text>
              <View style={styles.healthRowRight}>
                <Text style={styles.healthRowValue}>{vitals.spo2.value} <Text style={styles.healthRowUnit}>{vitals.spo2.unit}</Text></Text>
                <Text style={[styles.healthRowStatus, { color: getStatusColor(vitals.spo2.status as any) }]}>{vitals.spo2.statusLabel}</Text>
              </View>
            </View>
          )}

          {vitals?.temperature && (
            <View style={[styles.healthRow, styles.itemBorderBottom]}>
              <View style={[styles.healthIconWrap, { backgroundColor: Colors.warningLight }]}>
                <Thermometer size={18} color={Colors.warning} />
              </View>
              <Text style={styles.healthRowTitle}>Body Temp</Text>
              <View style={styles.healthRowRight}>
                <Text style={styles.healthRowValue}>{vitals.temperature.value} <Text style={styles.healthRowUnit}>{vitals.temperature.unit}</Text></Text>
                <Text style={[styles.healthRowStatus, { color: getStatusColor(vitals.temperature.status as any) }]}>{vitals.temperature.statusLabel}</Text>
              </View>
            </View>
          )}

          {vitals?.steps && (
            <View style={styles.healthRow}>
              <View style={[styles.healthIconWrap, { backgroundColor: Colors.safeLight }]}>
                <Footprints size={18} color={Colors.safe} />
              </View>
              <Text style={styles.healthRowTitle}>Daily Activity</Text>
              <View style={styles.healthRowRight}>
                <Text style={styles.healthRowValue}>{vitals.steps.value} <Text style={styles.healthRowUnit}>{vitals.steps.unit}</Text></Text>
                <Text style={[styles.healthRowStatus, { color: getStatusColor(vitals.steps.status as any) }]}>{vitals.steps.statusLabel}</Text>
              </View>
            </View>
          )}
        </Card>
      </View>

      {/* 6. TODAY'S CARE */}
\;

text = text.replace(oldHealthSectionRegex, newHealthSection);

const newStyles = \
  // HEALTH LIST STYLES
  healthListCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.primary,
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 2,
    overflow: 'hidden',
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  healthIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  healthRowTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  healthRowRight: {
    alignItems: 'flex-end',
  },
  healthRowValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  healthRowUnit: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  healthRowStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
\;

text = text.replace('// HEALTH OVERVIEW (SPARKLINES)', newStyles + '\n  // HEALTH OVERVIEW (SPARKLINES)');

fs.writeFileSync('app/(parent)/index.tsx', text, 'utf8');
