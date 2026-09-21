import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput as RNTextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  Phone,
  Mail,
  Edit2,
  Trash2,
  UserPlus,
  Shield,
  X,
  CheckCircle2,
} from 'lucide-react-native';

import { ScreenContainer, TopBar, Card, Button, TextInput } from '@/components/ui';
import { useElderly } from '@/context/ElderlyContext';
import { apiUpdateCaregiver, apiDeleteUser } from '@/services/elderlyService';

export default function ManageCaregiversScreen() {
  const router = useRouter();
  const { activeProfile, hasCaregiver, assignedCaregiverName, updateProfile } = useElderly();

  const caregiverName = assignedCaregiverName || 'Amara Biya';
  const caregiverIdRaw = activeProfile?.primaryCaregiverId || 'usr-caregiver-01';
  const numericCaregiverId = parseInt(caregiverIdRaw.replace(/\D/g, '')) || 1;

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(caregiverName);
  const [editPhone, setEditPhone] = useState('+237 699 12 34 56');
  const [isLoading, setIsLoading] = useState(false);

  const handleEditSave = async () => {
    setIsLoading(true);
    const res = await apiUpdateCaregiver(numericCaregiverId, {
      fullName: editName,
      phoneNumber: editPhone,
    });
    setIsLoading(false);

    if (res.success) {
      if (activeProfile) {
        updateProfile(activeProfile.id, { primaryCaregiverName: editName });
      }
      setEditModalVisible(false);
      Alert.alert('Success', 'Caregiver profile updated.');
    } else {
      Alert.alert('Error', res.error || 'Could not update caregiver.');
    }
  };

  const handleRemoveCaregiver = () => {
    Alert.alert(
      'Remove Caregiver',
      `Are you sure you want to remove ${caregiverName} from this profile?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const res = await apiDeleteUser(numericCaregiverId);
            if (res.success) {
              if (activeProfile) {
                updateProfile(activeProfile.id, {
                  primaryCaregiverId: undefined,
                  primaryCaregiverName: undefined,
                });
              }
              Alert.alert('Removed', 'Caregiver has been unassigned.');
            } else {
              Alert.alert('Error', res.error || 'Failed to remove caregiver.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer scrollable padded backgroundColor="#F0F4FA">
      <TopBar title="Manage Caregivers" onBack={() => router.back()} />

      <View style={{ height: 16 }} />

      {!hasCaregiver ? (
        <Card style={styles.emptyCard}>
          <View style={styles.emptyIconWrap}>
            <User size={32} color="#64748B" />
          </View>
          <Text style={styles.emptyTitle}>No Caregiver Assigned</Text>
          <Text style={styles.emptySub}>
            You haven't assigned a caregiver to {activeProfile?.fullName || 'the senior'} yet.
          </Text>
          <View style={{ height: 20 }} />
          <Button
            title="Provision a Caregiver"
            onPress={() => router.push('/(parent)/caregivers/create' as any)}
            variant="primary"
            leftIcon={<UserPlus size={18} color="#FFF" />}
          />
        </Card>
      ) : (
        <>
          <Card style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>{caregiverName.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{caregiverName}</Text>
                <Text style={styles.roleBadge}>PRIMARY CAREGIVER</Text>
              </View>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setEditModalVisible(true)}
                >
                  <Edit2 size={18} color="#2563EB" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#FEF2F2' }]}
                  onPress={handleRemoveCaregiver}
                >
                  <Trash2 size={18} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Phone size={16} color="#64748B" />
              <Text style={styles.detailText}>{editPhone}</Text>
            </View>
            <View style={styles.detailRow}>
              <Mail size={16} color="#64748B" />
              <Text style={styles.detailText}>
                {caregiverName.toLowerCase().replace(/\s+/g, '.')}@elderguard.cm
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Shield size={16} color="#16A34A" />
              <Text style={[styles.detailText, { color: '#16A34A' }]}>
                Active & Monitored
              </Text>
            </View>
          </Card>

          <View style={{ height: 16 }} />

          <Button
            title="Reassign Caregiver"
            onPress={() => router.push('/(parent)/caregivers/create' as any)}
            variant="outline"
            leftIcon={<UserPlus size={18} color="#2563EB" />}
          />
        </>
      )}

      {/* Edit Modal */}
      <Modal visible={isEditModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Caregiver</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TextInput
              label="Full Name"
              value={editName}
              onChangeText={setEditName}
            />
            <View style={{ height: 12 }} />
            <TextInput
              label="Phone Number"
              value={editPhone}
              onChangeText={setEditPhone}
              keyboardType="phone-pad"
            />

            <View style={{ height: 24 }} />
            <Button
              title="Save Changes"
              onPress={handleEditSave}
              loading={isLoading}
              variant="primary"
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0284C7',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  roleBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#475569',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
});
