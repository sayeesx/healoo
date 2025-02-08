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
} from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import moment from "moment"
import { UIManager } from "react-native"

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
        shadowColor: "#6B4EFF",
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
    backgroundColor: "#6B4EFF",
    borderColor: "#6B4EFF",
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recordTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#6C757D",
  },
  downloadButton: {
    padding: 8,
    backgroundColor: "#F8F7FF",
    borderRadius: 12,
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
    backgroundColor: "#F8F7FF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  viewButtonText: {
    color: "#6B4EFF",
    fontSize: 15,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6B4EFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    backgroundColor: "#6B4EFF",
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
  },
]

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const LabRecords = React.memo(
  function LabRecords() {
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [filterType, setFilterType] = useState("All")
    const [sortedRecords, setSortedRecords] = useState([])

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

    const getDaysAgo = useCallback((date) => {
      const days = moment().diff(moment(date), "days")
      if (days === 0) return "Today"
      if (days === 1) return "Yesterday"
      return `${days} days ago`
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

    const renderItem = useCallback(
      ({ item: record }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              setSelectedRecord(record)
              setModalVisible(true)
            }}
            activeOpacity={0.7}
          >
            <View style={styles.recordCard}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: record.type === "Radiology" ? "#FFF3E0" : "#E8F5E9" },
                  ]}
                >
                  <FontAwesome
                    name={record.type === "Radiology" ? "x-ray" : "file-text-o"}
                    size={24}
                    color={record.type === "Radiology" ? "#FF9800" : "#4CAF50"}
                  />
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.recordTitle}>{record.title}</Text>
                  <Text style={styles.date}>
                    {moment(record.date).format("MMM DD, YYYY")} • {getDaysAgo(record.date)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => {
                    /* Handle download */
                  }}
                  activeOpacity={0.7}
                >
                  <Icon name="download" size={24} color="#6B4EFF" />
                </TouchableOpacity>
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
                    style={[styles.severityContainer, { backgroundColor: `${getSeverityColor(record.severity)}20` }]}
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
                }}
              >
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )
      },
      [getDaysAgo, getSeverityColor, getStatusColor],
    )

    const keyExtractor = useCallback((item) => item.id.toString(), [])

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Lab Records</Text>
            <TouchableOpacity style={styles.aiButton} activeOpacity={0.8}>
              <Icon name="robot" size={24} color="#6B4EFF" />
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
          <FlatList
            data={filteredRecords}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={5}
            initialNumToRender={8}
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
                      onPress={() => {
                        /* Handle download */
                      }}
                    >
                      <Icon name="download" size={20} color="#fff" />
                      <Text style={styles.modalButtonText}>Download Report</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    )
  },
  (prevProps, nextProps) => {
    // Implement a custom comparison if needed
    return true
  },
)

export default LabRecords

