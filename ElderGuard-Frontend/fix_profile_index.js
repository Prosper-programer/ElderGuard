const fs = require('fs');
let text = fs.readFileSync('app/(parent)/profile/index.tsx', 'utf8');

// We are going to replace everything inside the <ScrollView> with clean, truthful data.
// 1. We need to locate the ScrollView children.
const regex = /(<ScrollView[^>]*>)([\s\S]*?)(<View style=\{\{ height: Spacing.xl \}\} \/>\s*<\/ScrollView>)/;
const match = text.match(regex);
if(match) {
  const newContent = \
      {/* -- Patient Identity Card ------------------ */}
      <Card style={styles.profileCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardHeading}>Patient Identity</Text>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push('/(parent)/profile/edit' as any)}
            activeOpacity={0.7}
          >
            <Edit2 size={15} color={Colors.primary} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileBody}>
          <View style={styles.avatarRow}>
            {photo ? (<Image source={typeof photo === 'string' ? { uri: photo } : photo} style={styles.avatarImage} />) : (<View style={[styles.avatarImage, { backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' }]}><Text style={{fontSize: 24, fontWeight: 'bold', color: '#64748B'}}>{name.slice(0, 2).toUpperCase()}</Text></View>)}
            <View style={styles.statusBadgeWrap}>
              <StatusBadge status="safe" size="md" />
            </View>
          </View>

          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileSub}>Born {dob} · {age} years old · {activeProfile?.gender || 'Unknown'}</Text>
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
        </View>
      </Card>

      {/* Medical Information */}
      {activeProfile?.medicalInfo?.chronicConditions && activeProfile.medicalInfo.chronicConditions.length > 0 && activeProfile.medicalInfo.chronicConditions[0] !== '' && (
        <Card style={styles.conditionsCard}>
          <Text style={styles.cardHeading}>Medical Information</Text>
          <View style={styles.conditionsList}>
            <View style={styles.conditionRow}>
              <View style={styles.conditionRedDot} />
              <Text style={styles.conditionText}>{activeProfile.medicalInfo.chronicConditions[0]}</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Emergency Contact */}
      <View style={styles.sectionWrap}>
        <SectionHeader title="Emergency Contact" />
        <Card style={styles.cardZeroPadding}>
          <View style={[styles.contactRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.contactInitials, { backgroundColor: Colors.primaryFaded }]}>
              <Text style={[styles.contactInitialsText, { color: Colors.primary }]}>
                EC
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>Primary Emergency Contact</Text>
              <Text style={styles.contactRole}>Designated Number</Text>
              <Text style={styles.contactPhone}>{activeProfile?.phone || 'Not Set'}</Text>
            </View>

            {activeProfile?.phone && (
              <TouchableOpacity
                onPress={() => handleCall(activeProfile.phone as string)}
                style={styles.callCircleBtn}
                activeOpacity={0.7}
              >
                <Phone size={16} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </Card>
      </View>

      {/* Caregiver & Doctor Info */}
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
              {activeProfile?.doctorPhone && (
                <Text style={styles.contactPhone}>{activeProfile.doctorPhone}</Text>
              )}
            </View>
          </View>
        </Card>
      </View>

      {/* -- My Tutor Account & Session Card ------------------ */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionOverline}>ACCOUNT & SESSION</Text>
        </View>

        <Card style={styles.accountCard}>
          <View style={styles.accountRow}>
            <View style={styles.accountAvatarBox}>
              <Text style={styles.accountAvatarText}>
                {(user?.name || 'User')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.accountName}>{user?.name || 'Current User'}</Text>
              <Text style={styles.accountEmail}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>
          <View style={styles.accountDivider} />
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
            <LogOut size={18} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </Card>
      </View>
\;

  text = text.replace(regex, "\\n" + newContent + "\n\");
  fs.writeFileSync('app/(parent)/profile/index.tsx', text, 'utf8');
} else {
  console.log("Could not find ScrollView in profile index");
}

