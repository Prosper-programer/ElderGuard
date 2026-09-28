const fs = require('fs');
let text = fs.readFileSync('app/(parent)/profile/index.tsx', 'utf8');

const regex = /(\{\/\* 3-Col Clinical Specs \*\/\}[\s\S]*?)(\{\/\* ── My Tutor Account & Session Card ────────────────── \*\/})/g;

const newContent = `
          {/* We removed the hardcoded 3-col clinical specs (height, weight) because they aren't collected during creation */}
        </View>
      </Card>

      {/* Home Address Card */}
      <Card style={styles.addressCard}>
        <View style={styles.addressIconWrap}>
          <MapPin size={18} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.addressHeading}>Home Address</Text>
          <Text style={styles.addressText}>{activeProfile?.address || 'No Address Provided'}</Text>
          {activeProfile?.address ? <Text style={styles.roomText}>Primary Residence</Text> : null}
        </View>
      </Card>

      {/* Medical Conditions */}
      {activeProfile?.medicalInfo?.chronicConditions && activeProfile.medicalInfo.chronicConditions.length > 0 && activeProfile.medicalInfo.chronicConditions[0] !== '' && (
        <Card style={styles.conditionsCard}>
          <Text style={styles.cardHeading}>Medical Information</Text>
          <View style={styles.conditionsList}>
            {activeProfile.medicalInfo.chronicConditions.map((cond, i) => (
              <View key={i} style={styles.conditionRow}>
                <View style={styles.conditionRedDot} />
                <Text style={styles.conditionText}>{cond}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Real Emergency Contact */}
      <View style={styles.sectionWrap}>
        <SectionHeader title="Emergency Contact" />
        <Card style={styles.cardZeroPadding}>
          <View style={[styles.contactRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.contactInitials, { backgroundColor: Colors.primaryFaded || '#3C6FDB18' }]}>
              <Text style={[styles.contactInitialsText, { color: Colors.primary }]}>
                EC
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>Primary Emergency Contact</Text>
              <Text style={styles.contactRole}>Designated Number</Text>
              <Text style={styles.contactPhone}>{activeProfile?.phone || 'Not Set'}</Text>
            </View>

            {activeProfile?.phone ? (
              <TouchableOpacity
                onPress={() => handleCall(activeProfile.phone)}
                style={styles.callCircleBtn}
                activeOpacity={0.7}
              >
                <Phone size={16} color={Colors.primary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </Card>
      </View>

      {/* Assigned Caregiver & Doctor */}
      <View style={styles.sectionWrap}>
        <SectionHeader title="Assigned Personnel" />
        <Card style={styles.cardZeroPadding}>
          <View style={styles.contactRow}>
            <View style={[styles.contactInitials, { backgroundColor: '#16A34A18' }]}>
              <Text style={[styles.contactInitialsText, { color: '#16A34A' }]}>
                CG
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>{activeProfile?.primaryCaregiverName || 'No Caregiver Assigned'}</Text>
              <Text style={styles.contactRole}>Primary Caregiver</Text>
            </View>
          </View>
          <View style={[styles.contactRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.contactInitials, { backgroundColor: '#8B5CF618' }]}>
              <Text style={[styles.contactInitialsText, { color: '#8B5CF6' }]}>
                DR
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>{activeProfile?.doctorName || 'No Doctor Assigned'}</Text>
              <Text style={styles.contactRole}>Attending Physician</Text>
              {activeProfile?.doctorPhone ? (
                <Text style={styles.contactPhone}>{activeProfile.doctorPhone}</Text>
              ) : null}
            </View>
          </View>
        </Card>
      </View>

      {/* ── My Tutor Account & Session Card ────────────────── */}
`;

text = text.replace(regex, newContent);
fs.writeFileSync('app/(parent)/profile/index.tsx', text, 'utf8');
