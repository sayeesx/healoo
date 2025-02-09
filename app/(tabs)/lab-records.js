import React, { useState, useEffect, useCallback, useMemo } from "react"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Dimensions,
  Platform,
  FlatList,
  LayoutAnimation,
  Animated,
  Share,
  Alert,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import moment from "moment"
import { UIManager } from "react-native"
import { handleScroll } from "../../components/CustomTabBar"

const { width } = Dimensions.get("window")

const FILTER_TYPES = ["All", "Blood Test", "Radiology"]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#212529",
    letterSpacing: -0.5,
  },
  aiButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F8F7FF",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#3B39E4",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  filterContainer: {
    flexDirection: "row",
    marginTop: 10,
    paddingBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  activeFilterChip: {
    backgroundColor: "#3B39E4",
    borderColor: "#3B39E4",
  },
  filterChipText: {
    color: "#495057",
    fontSize: 15,
    fontWeight: "600",
  },
  activeFilterChipText: {
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  recordCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recordInfo: {
    flex: 1,
  },
  recordActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  recordType: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordDate: {
    fontSize: 14,
    color: "#6C757D",
  },
  daysAgo: {
    fontSize: 14,
    color: '#6C757D',
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F8F7FF",
  },
  cardContent: {
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
    paddingTop: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#6C757D",
  },
  value: {
    fontSize: 14,
    color: "#212529",
    fontWeight: "500",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  severityContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 13,
    fontWeight: "600",
  },
  viewButton: {
    backgroundColor: "#3B39E4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  viewButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    flex: 1,
  },
  modalDescription: {
    fontSize: 16,
    color: "#495057",
    marginBottom: 24,
    lineHeight: 24,
  },
  modalInfoSection: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  modalInfoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 16,
  },
  modalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 15,
    color: "#6C757D",
  },
  modalValue: {
    fontSize: 15,
    color: "#212529",
    fontWeight: "500",
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
    paddingTop: 16,
  },
  modalButton: {
    backgroundColor: "#3B39E4",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContent: {
    padding: 16,
  },
  aiModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiModalContent: {
    backgroundColor: '#FFFFFF',
    width: '85%',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#3B39E4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  aiModalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 57, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B39E4',
    marginBottom: 12,
    textAlign: 'center',
  },
  aiModalMessage: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  aiModalButton: {
    backgroundColor: '#3B39E4',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
  },
  aiModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
})

const labRecords = [
  {
    id: 1,
    title: "Complete Blood Count",
    date: "2025-02-05",
    doctor: "Dr. Sarah Johnson",
    lab: "Central Medical Lab",
    location: "New York Medical Center, 5th Avenue",
    status: "Completed",
    severity: "Normal",
    type: "Blood Test",
    description: "Routine blood test to check overall health status",
    viewed: false,
  },
  {
    id: 2,
    title: "Chest X-Ray",
    date: "2025-02-07",
    doctor: "Dr. Michael Chen",
    lab: "Advanced Imaging Center",
    location: "Memorial Hospital, West Wing",
    status: "Completed",
    severity: "Serious",
    type: "Radiology",
    description: "Chest examination for respiratory concerns",
    viewed: false,
  },
  {
    id: 3,
    title: "Brain MRI Scan",
    date: "2025-02-08",
    doctor: "Dr. Emily Brown",
    lab: "Neurological Institute",
    location: "City General Hospital, Block C",
    status: "Pending",
    severity: "Urgent",
    type: "Radiology",
    description: "Detailed brain scan for neurological assessment",
    viewed: false,
  },
  {
    id: 4,
    title: "Lipid Profile",
    date: "2025-02-06",
    doctor: "Dr. Robert Wilson",
    lab: "Cardiac Care Lab",
    location: "Heart Institute, South Block",
    status: "Completed",
    severity: "Attention",
    type: "Blood Test",
    description: "Cholesterol and triglycerides assessment",
    viewed: false,
  },
  {
    id: 5,
    title: "Thyroid Function Test",
    date: "2025-02-08",
    doctor: "Dr. Lisa Martinez",
    lab: "Endocrine Center",
    location: "Specialty Clinic, East Wing",
    status: "Processing",
    severity: "Normal",
    type: "Blood Test",
    description: "Comprehensive thyroid hormone analysis",
    viewed: false,
  },
  {
    id: 6,
    title: "Bone Density Scan",
    date: "2025-02-07",
    doctor: "Dr. James Park",
    lab: "Orthopedic Imaging",
    location: "Bone & Joint Center, 3rd Floor",
    status: "Completed",
    severity: "Attention",
    type: "Radiology",
    description: "Osteoporosis screening and bone health assessment",
    viewed: false,
  },
]

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const getDaysAgo = (date) => {
  const days = moment().diff(moment(date), 'days');
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
};

const LabRecords = React.memo(
  function LabRecords() {
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [filterType, setFilterType] = useState("All")
    const [sortedRecords, setSortedRecords] = useState([])
    const [showAIModal, setShowAIModal] = useState(false)

    useEffect(() => {
      const sorted = [...labRecords].sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf())
      setSortedRecords(sorted)
    }, [])

    const filteredRecords = useMemo(() => {
      if (filterType === "All") return sortedRecords
      return sortedRecords.filter((record) => record.type === filterType)
    }, [filterType, sortedRecords])

    const handleFilterChange = useCallback(
      (newFilter) => {
        if (newFilter === filterType) return

        // Use LayoutAnimation for smoother transitions
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

        setFilterType(newFilter)
      },
      [filterType],
    )

    const renderFilterChip = useCallback(
      ({ item: type }) => {
        const isActive = filterType === type
        return (
          <TouchableOpacity
            style={[styles.filterChip, isActive && styles.activeFilterChip]}
            onPress={() => handleFilterChange(type)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, isActive && styles.activeFilterChipText]}>{type}</Text>
          </TouchableOpacity>
        )
      },
      [filterType, handleFilterChange],
    )

    const getStatusColor = useCallback((status) => {
      switch (status.toLowerCase()) {
        case "completed":
          return "#4CAF50"
        case "processing":
          return "#2196F3"
        default:
          return "#FF9800"
      }
    }, [])

    const getSeverityColor = useCallback((severity) => {
      switch (severity.toLowerCase()) {
        case "serious":
          return "#FF4444"
        case "urgent":
          return "#FF9800"
        case "attention":
          return "#FFD600"
        default:
          return "#4CAF50"
      }
    }, [])

    const handleShare = async (record) => {
      try {
        const result = await Share.share({
          message: `Lab Report from ${record.lab}\nType: ${record.type}\nDate: ${record.date}\nDoctor: ${record.doctor}\n\nDescription: ${record.description}`,
          title: `Lab Report - ${record.type}`,
        });

        if (result.action === Share.sharedAction) {
          // Update the record as viewed after sharing
          const updatedRecords = sortedRecords.map((r) =>
            r.id === record.id ? { ...r, viewed: true } : r
          );
          setSortedRecords(updatedRecords);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const renderItem = useCallback(
      ({ item: record }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              setSelectedRecord(record)
              setModalVisible(true)
              // Mark as viewed when opened
              const updatedRecords = sortedRecords.map((r) =>
                r.id === record.id ? { ...r, viewed: true } : r
              )
              setSortedRecords(updatedRecords)
            }}
            style={styles.recordCard}
          >
            <View style={styles.recordHeader}>
              <View style={styles.recordInfo}>
                <Text style={styles.recordType}>{record.title}</Text>
                <View style={styles.dateContainer}>
                  <Text style={styles.recordDate}>
                    {moment(record.date).format("MMM DD, YYYY")}
                  </Text>
                  <Text style={styles.daysAgo}>• {getDaysAgo(record.date)}</Text>
                </View>
              </View>
              <View style={styles.recordActions}>
                <TouchableOpacity
                  onPress={() => handleShare(record)}
                  style={styles.shareButton}
                >
                  <Icon name="share-variant" size={24} color="#3B39E4" />
                </TouchableOpacity>
                {record.viewed ? (
                  <Icon name="eye-check" size={24} color="#28A745" />
                ) : (
                  <Icon name="eye-outline" size={24} color="#6C757D" />
                )}
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Doctor</Text>
                <Text style={styles.value}>{record.doctor}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Lab</Text>
                <Text style={styles.value}>{record.lab}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Location</Text>
                <Text style={styles.value}>{record.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Status</Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(record.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(record.status) }]}>{record.status}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Severity</Text>
                <View
                  style={[
                    styles.severityContainer,
                    { backgroundColor: `${getSeverityColor(record.severity)}20` },
                  ]}
                >
                  <Text style={[styles.severityText, { color: getSeverityColor(record.severity) }]}>
                    {record.severity}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => {
                setSelectedRecord(record)
                setModalVisible(true)
                // Mark as viewed when opened
                const updatedRecords = sortedRecords.map((r) =>
                  r.id === record.id ? { ...r, viewed: true } : r
                )
                setSortedRecords(updatedRecords)
              }}
            >
              <Text style={styles.viewButtonText}>View Details</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )
      },
      [sortedRecords],
    )

    const keyExtractor = useCallback((item) => item.id.toString(), [])

    const handleAIButtonPress = () => {
      setShowAIModal(true);
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Lab Records</Text>
            <TouchableOpacity 
              style={styles.aiButton} 
              activeOpacity={0.8}
              onPress={handleAIButtonPress}
            >
              <Icon name="robot" size={24} color="#3B39E4" />
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            data={FILTER_TYPES}
            renderItem={renderFilterChip}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Animated.FlatList
            data={filteredRecords}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedRecord && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedRecord.title}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                      <Icon name="close" size={24} color="#000" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={styles.modalBody}>
                    <Text style={styles.modalDescription}>{selectedRecord.description}</Text>
                    <View style={styles.modalInfoSection}>
                      <Text style={styles.modalInfoTitle}>Report Details</Text>
                      <View style={styles.modalInfoRow}>
                        <Text style={styles.modalLabel}>Date</Text>
                        <Text style={styles.modalValue}>{moment(selectedRecord.date).format("MMMM DD, YYYY")}</Text>
                      </View>
                      <View style={styles.modalInfoRow}>
                        <Text style={styles.modalLabel}>Doctor</Text>
                        <Text style={styles.modalValue}>{selectedRecord.doctor}</Text>
                      </View>
                      <View style={styles.modalInfoRow}>
                        <Text style={styles.modalLabel}>Lab</Text>
                        <Text style={styles.modalValue}>{selectedRecord.lab}</Text>
                      </View>
                      <View style={styles.modalInfoRow}>
                        <Text style={styles.modalLabel}>Location</Text>
                        <Text style={styles.modalValue}>{selectedRecord.location}</Text>
                      </View>
                    </View>
                  </ScrollView>
                  <View style={styles.modalFooter}>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => handleShare(selectedRecord)}
                    >
                      <Icon name="share-variant" size={20} color="#fff" />
                      <Text style={styles.modalButtonText}>Share Report</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
        {/* AI Coming Soon Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showAIModal}
          onRequestClose={() => setShowAIModal(false)}
        >
          <View style={styles.aiModalOverlay}>
            <View style={styles.aiModalContent}>
              <View style={styles.aiModalIconContainer}>
                <Icon name="robot" size={40} color="#3B39E4" />
              </View>
              <Text style={styles.aiModalTitle}>AI Assistant Coming Soon!</Text>
              <Text style={styles.aiModalMessage}>
                We're working on something exciting! Our AI assistant is being developed to make your healthcare experience even better.
              </Text>
              <TouchableOpacity
                style={styles.aiModalButton}
                onPress={() => setShowAIModal(false)}
              >
                <Text style={styles.aiModalButtonText}>Got it!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    )
  },
  (prevProps, nextProps) => {
    return true
  },
)

export default LabRecords
