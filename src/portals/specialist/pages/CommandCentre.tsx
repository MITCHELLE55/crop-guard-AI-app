/**
 * This page is the specialist portal's dashboard and farmer support workspace.
 * Specialists use it to review cases, acknowledge coordinator messages, inspect farmer details,
 * chat, approve cautious guidance, and record consultations.
 * The dashboard shows workload cards, a searchable case queue, an active consultation, alerts,
 * visits, and recent activity. Sidebar routes open dedicated inbox, farmer, chat, treatment,
 * and interaction record panels.
 * All records in this frontend are illustrative local state. No service is called, and the page
 * does not upload data, generate a diagnosis, or send advice. Images, voice notes, live map tiles,
 * and product label data are unavailable and are explained in the panels.
 * Data is available immediately from local fixtures, so there is no network loading state.
 * Empty search and record lists show explanatory messages. Local actions announce confirmation
 * through status messages; service errors cannot occur because no service is connected.
 * The specialist enters from the local demo login, uses the sidebar to switch work areas, and can
 * open a selected case in the consultation workspace.
 */
import { useMemo, useState, type FormEvent } from 'react'
import Icon from '../../../components/Icon'
import type { SpecialistSection } from '../types'

/**
 * The illustrative farmer and crop issue shown in the specialist case queue.
 * Every field is local demo content and does not describe a real farmer.
 */
type FarmerCase = {
  id: string
  name: string
  initials: string
  phone: string
  email: string
  crop: string
  location: string
  coordinates: string
  issue: string
  submittedAt: string
  confidence: number
  severity: 'Severe' | 'High' | 'Moderate'
  status: string
  color: string
}

/**
 * One illustrative coordinator message shown in the local notifications inbox.
 * It stores the display details, read state, acknowledgement state, and farmer link.
 * No value is sent to or loaded from a server in this prototype.
 */
type DemoNotification = {
  id: string
  title: string
  description: string
  farmerId: string
  receivedAt: string
  category: 'Assignment' | 'Disease report' | 'Pest infestation' | 'Assistance request'
  status: 'Pending Acknowledgement' | 'Received'
  acknowledgedAt: string
  isRead: boolean
}

/**
 * A chat message used to demonstrate the conversation layout.
 * The sender is either the farmer or the signed in specialist.
 */
type DemoMessage = {
  id: string
  sender: 'farmer' | 'specialist'
  text: string
  sentAt: string
  isRead: boolean
}

/** The four interaction types available in the local interaction record form. */
type InteractionType = 'Chat' | 'Phone call' | 'Farm visit' | 'Consultation'

/**
 * A specialist's saved interaction note for one farmer.
 * These records live only in React state and are lost when the page reloads.
 */
type InteractionRecord = {
  id: string
  farmerId: string
  occurredAt: string
  type: InteractionType
  problem: string
  observations: string
  recommendation: string
  treatment: string
  advice: string
  followUp: string
  notes: string
}

const farmerCases: FarmerCase[] = [
  {
    id: 'REC-2026-891',
    name: 'Kiplagat Kiprono',
    initials: 'KK',
    phone: '+254 700 000 891',
    email: 'kiplagat.demo@example.test',
    crop: 'Maize',
    location: 'Nakuru County',
    coordinates: '0.3031° S, 36.0800° E',
    issue: 'Fall armyworm',
    submittedAt: '2026-11-17T10:02:00',
    confidence: 93,
    severity: 'Severe',
    status: 'Awaiting review',
    color: 'sage',
  },
  {
    id: 'REC-2026-884',
    name: 'Grace Achieng',
    initials: 'GA',
    phone: '+254 700 000 884',
    email: 'grace.demo@example.test',
    crop: 'Maize',
    location: 'Kisumu County',
    coordinates: '0.0917° S, 34.7680° E',
    issue: 'Northern leaf blight',
    submittedAt: '2026-11-17T09:18:00',
    confidence: 87,
    severity: 'High',
    status: 'Under review',
    color: 'gold',
  },
  {
    id: 'REC-2026-872',
    name: 'Peter Mwangi',
    initials: 'PM',
    phone: '+254 700 000 872',
    email: 'peter.demo@example.test',
    crop: 'Tomato',
    location: 'Kiambu County',
    coordinates: '1.1714° S, 36.8356° E',
    issue: 'Early blight',
    submittedAt: '2026-11-16T15:40:00',
    confidence: 78,
    severity: 'Moderate',
    status: 'Follow-up due',
    color: 'blue',
  },
]

const initialNotifications: DemoNotification[] = [
  {
    id: 'NTF-301',
    title: 'New farmer assignment',
    description: 'Please review the new maize report and contact the farmer with next steps.',
    farmerId: 'REC-2026-891',
    receivedAt: '2026-11-17T10:30:00',
    category: 'Assignment',
    status: 'Pending Acknowledgement',
    acknowledgedAt: '',
    isRead: false,
  },
  {
    id: 'NTF-298',
    title: 'Crop disease report',
    description: 'Leaf damage was reported. Review the submitted evidence before advising.',
    farmerId: 'REC-2026-884',
    receivedAt: '2026-11-17T09:45:00',
    category: 'Disease report',
    status: 'Pending Acknowledgement',
    acknowledgedAt: '',
    isRead: false,
  },
  {
    id: 'NTF-293',
    title: 'Assistance requested',
    description: 'The farmer requested guidance after spotting unusual crop symptoms.',
    farmerId: 'REC-2026-872',
    receivedAt: '2026-11-16T15:55:00',
    category: 'Assistance request',
    status: 'Received',
    acknowledgedAt: '2026-11-16T16:05:00',
    isRead: true,
  },
  {
    id: 'NTF-291',
    title: 'Pest infestation report',
    description: 'A suspected pest issue was reported. Review the case evidence before advising.',
    farmerId: 'REC-2026-891',
    receivedAt: '2026-11-16T14:20:00',
    category: 'Pest infestation',
    status: 'Received',
    acknowledgedAt: '2026-11-16T14:35:00',
    isRead: true,
  },
]

const initialMessages: Record<string, DemoMessage[]> = {
  'REC-2026-891': [
    { id: 'MSG-1', sender: 'farmer', text: 'I have uploaded the latest crop photos. What should I check next?', sentAt: '2026-11-17T10:42:00', isRead: false },
  ],
  'REC-2026-884': [
    { id: 'MSG-2', sender: 'farmer', text: 'The spots have spread to a few more leaves since yesterday.', sentAt: '2026-11-17T09:25:00', isRead: false },
  ],
  'REC-2026-872': [
    { id: 'MSG-3', sender: 'specialist', text: 'Please note whether the lower leaves are affected first.', sentAt: '2026-11-16T16:10:00', isRead: true },
  ],
}

/** The consultation sections shown inside the existing selected case workspace. */
const workspaceTabs = [
  'Farm profile',
  'AI diagnosis',
  'Expert advice',
  'Treatments',
  'Farm visit',
  'Communication',
  'Case records',
] as const

/** One existing tab name used to select a section inside the consultation workspace. */
type WorkspaceTab = (typeof workspaceTabs)[number]

/**
 * Inputs the specialist command centre receives from the app shell.
 * @property activeSection The sidebar destination currently open, such as `cases`.
 * @property showConsultation Whether the consultation workspace heading is active.
 * @property searchQuery The current global search text, or an empty string.
 * @property onSearchChange Updates the global search text when the specialist types.
 * @property onOpenConsultation Opens the selected farmer's consultation workspace.
 * @property onNavigate Opens another specialist sidebar destination.
 * @remarks `App.tsx` supplies these values when it renders this page.
 */
type CommandCentreProps = {
  activeSection: SpecialistSection
  showConsultation: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  onOpenConsultation: () => void
  onNavigate: (section: SpecialistSection) => void
}

/**
 * The specialist's dashboard and case workspace.
 * It keeps demo notifications, messages, approvals, and notes in local component state.
 * @param props The current sidebar section, search value, and navigation callbacks.
 * @returns The existing command centre or the selected specialist workflow.
 * @remarks `App.tsx` renders this component for specialist dashboard routes.
 */
function CommandCentre({
  activeSection,
  showConsultation,
  searchQuery,
  onSearchChange,
  onOpenConsultation,
  onNavigate,
}: CommandCentreProps) {
  const [selectedCase, setSelectedCase] = useState(farmerCases[0])
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('AI diagnosis')
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [diagnosisDecision, setDiagnosisDecision] = useState<'pending' | 'confirmed' | 'overridden'>('pending')
  const [notice, setNotice] = useState('')
  const [caseNoteDraft, setCaseNoteDraft] = useState('')
  const [visitDetailsOpen, setVisitDetailsOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [selectedNotificationId, setSelectedNotificationId] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const [messageDraft, setMessageDraft] = useState('')
  const [approvedRecommendationAt, setApprovedRecommendationAt] = useState('')
  const [mapZoom, setMapZoom] = useState(1)
  const [interactionRecords, setInteractionRecords] = useState<InteractionRecord[]>([
    {
      id: 'INT-104',
      farmerId: 'REC-2026-884',
      occurredAt: '2026-11-17T09:50:00',
      type: 'Consultation',
      problem: 'Northern leaf blight',
      observations: 'Farmer reported new leaf spots. Image evidence needs follow up.',
      recommendation: 'Request additional close up images before treatment advice.',
      treatment: 'No chemical treatment recommended.',
      advice: 'Separate affected leaves and continue monitoring.',
      followUp: 'Review additional images tomorrow.',
      notes: 'Demo interaction record.',
    },
  ])
  const [interactionQuery, setInteractionQuery] = useState('')
  const [editingInteractionId, setEditingInteractionId] = useState('')
  const [interactionDraft, setInteractionDraft] = useState({
    occurredAt: new Date().toISOString().slice(0, 16),
    type: 'Consultation' as InteractionType,
    problem: '',
    observations: '',
    recommendation: '',
    treatment: '',
    advice: '',
    followUp: '',
    notes: '',
  })

  /**
   * Formats an ISO timestamp for the visible activity and message history.
   * @param value A date and time string, such as `2026-11-17T10:30:00`.
   * @returns The date and time in the browser's local format.
   * @remarks Used for notification, message, acknowledgement, and interaction timestamps.
   */
  const formatDateTime = (value: string) => new Date(value).toLocaleString()

  /**
   * Finds the selected farmer using the case identifier stored on an item.
   * @param farmerId A demo case identifier such as `REC-2026-891`.
   * @returns The matching farmer case, or the first case when no match exists.
   * @remarks Used to connect notifications and interaction notes to their farmer details.
   */
  const getFarmer = (farmerId: string) => farmerCases.find((farmerCase) => farmerCase.id === farmerId) ?? farmerCases[0]

  /**
   * Opens a coordinator message and marks it as read in this browser session.
   * @param notificationId The local identifier of the notification to open.
   * @returns Nothing; it updates local read state and changes the visible sidebar route.
   * @remarks The inbox calls this when a notification row is opened.
   */
  const openNotification = (notificationId: string) => {
    setSelectedNotificationId(notificationId)
    setNotifications((current) => current.map((item) => item.id === notificationId ? { ...item, isRead: true } : item))
    setNotice('')
    onNavigate('intelligence')
  }

  /**
   * Records that the specialist received a coordinator notification.
   * @param notificationId The local identifier of the notification to acknowledge.
   * @returns Nothing; it changes status and stores the current local time.
   * @remarks The notification detail panel calls this when its Received button is pressed.
   */
  const acknowledgeNotification = (notificationId: string) => {
    const acknowledgedAt = new Date().toISOString()
    setNotifications((current) => current.map((item) => item.id === notificationId
      ? { ...item, status: 'Received', acknowledgedAt, isRead: true }
      : item))
    setNotice('Notification received and acknowledged in this demo session.')
  }

  /**
   * Adds a specialist reply to the selected farmer's local conversation.
   * @param event The chat form submit event, used to stop a page reload.
   * @returns Nothing; it adds a timestamped message to React state.
   * @remarks The communication view uses this instead of sending data to a service.
   */
  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = messageDraft.trim()
    if (!text) return

    const farmerId = selectedCase.id
    setMessages((current) => ({
      ...current,
      [farmerId]: [...(current[farmerId] ?? []), {
        id: `MSG-${Date.now()}`,
        sender: 'specialist',
        text,
        sentAt: new Date().toISOString(),
        isRead: true,
      }],
    }))
    setMessageDraft('')
    setNotice('Message added to this demo conversation. It was not sent to the farmer.')
  }

  /**
   * Saves a new interaction note or updates the note currently being edited.
   * @param event The form submit event, used to stop a page reload.
   * @returns Nothing; it validates the reported problem and updates local records.
   * @remarks The interaction history view calls this for both create and edit actions.
   */
  const saveInteraction = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!interactionDraft.problem.trim()) {
      setNotice('Add the farmer reported problem before saving this interaction.')
      return
    }

    const record: InteractionRecord = {
      ...interactionDraft,
      id: editingInteractionId || `INT-${Date.now()}`,
      farmerId: selectedCase.id,
    }
    setInteractionRecords((current) => editingInteractionId
      ? current.map((item) => item.id === editingInteractionId ? record : item)
      : [record, ...current])
    setEditingInteractionId('')
    setInteractionDraft({
      occurredAt: new Date().toISOString().slice(0, 16),
      type: 'Consultation',
      problem: '',
      observations: '',
      recommendation: '',
      treatment: '',
      advice: '',
      followUp: '',
      notes: '',
    })
    setNotice(editingInteractionId ? 'Interaction updated in this demo session.' : 'Interaction saved in this demo session.')
  }

  /**
   * Copies a saved interaction into the form so the specialist can change it.
   * @param record The local interaction record selected from the history.
   * @returns Nothing; it selects the record's farmer and fills the editor fields.
   * @remarks Each interaction row uses this action through its Edit button.
   */
  const editInteraction = (record: InteractionRecord) => {
    setSelectedCase(getFarmer(record.farmerId))
    setEditingInteractionId(record.id)
    setInteractionDraft({
      occurredAt: record.occurredAt.slice(0, 16),
      type: record.type,
      problem: record.problem,
      observations: record.observations,
      recommendation: record.recommendation,
      treatment: record.treatment,
      advice: record.advice,
      followUp: record.followUp,
      notes: record.notes,
    })
    setNotice('Editing the selected interaction record.')
  }

  /**
   * Opens a farmer conversation and marks the farmer's sample messages as read.
   * @param farmerCase The farmer whose conversation should be shown.
   * @returns Nothing; it updates the selected case and local message read state.
   * @remarks The conversation list uses this when a specialist changes farmer.
   */
  const openConversation = (farmerCase: FarmerCase) => {
    setSelectedCase(farmerCase)
    setMessages((current) => ({
      ...current,
      [farmerCase.id]: (current[farmerCase.id] ?? []).map((message) => ({ ...message, isRead: true })),
    }))
    setNotice('')
  }

  /**
   * Approves the displayed non chemical demo plan for review with a farmer.
   * @returns Nothing; it stores a local approval time and a confirmation message.
   * @remarks No product label, recommendation service, or farmer messaging service is connected.
   */
  const approveRecommendation = () => {
    const approvedAt = new Date().toISOString()
    setApprovedRecommendationAt(approvedAt)
    setNotice('Demo plan approved for sharing. It has not been sent to the farmer.')
  }

  /**
   * Changes the selected farmer and clears case specific review messages.
   * @param farmerCase The case selected from the queue or farmer picker.
   * @returns Nothing; it updates the active case and its recommendation state.
   * @remarks Used by the case queue and farmer profile selectors.
   */
  const selectCase = (farmerCase: FarmerCase) => {
    setSelectedCase(farmerCase)
    setDiagnosisDecision('pending')
    setApprovedRecommendationAt('')
    setNotice('')
  }

  // Match queue records against the shared search text and optional urgency filter.
  const visibleCases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return farmerCases.filter((farmerCase) => {
      const matchesQuery = !query
        || [farmerCase.name, farmerCase.id, farmerCase.crop, farmerCase.location, farmerCase.issue, farmerCase.severity, farmerCase.status]
          .some((value) => value.toLowerCase().includes(query))
      const matchesUrgency = !urgentOnly || farmerCase.severity === 'Severe' || farmerCase.severity === 'High'
      return matchesQuery && matchesUrgency
    },
    )
  }, [searchQuery, urgentOnly])

  /**
   * Saves the specialist's decision about the illustrative AI finding.
   * @param decision The specialist's choice to confirm or override the finding.
   * @returns Nothing; it updates the visible decision and confirmation message.
   * @remarks The AI diagnosis tab uses this local prototype action.
   */
  const markDecision = (decision: 'confirmed' | 'overridden') => {
    setDiagnosisDecision(decision)
    setNotice(decision === 'confirmed'
      ? 'AI finding confirmed. Add your observations before saving the case.'
      : 'AI finding marked for override. Record the specialist diagnosis in case notes.')
  }

  /**
   * Saves consultation observations as a local interaction history record.
   * @returns Nothing; it validates the note, stores a record, and clears the editor.
   * @remarks The expert advice tab calls this; the record remains in this browser session.
   */
  const saveCaseNote = () => {
    const observations = caseNoteDraft.trim()
    if (!observations) {
      setNotice('Add your observations before saving this case note.')
      return
    }

    setInteractionRecords((current) => [{
      id: `INT-${Date.now()}`,
      farmerId: selectedCase.id,
      occurredAt: new Date().toISOString(),
      type: 'Consultation',
      problem: selectedCase.issue,
      observations,
      recommendation: approvedRecommendationAt ? 'Integrated pest management guidance approved in this session.' : '',
      treatment: 'No chemical product details are available in this demo.',
      advice: observations,
      followUp: '',
      notes: 'Saved from the consultation workspace.',
    }, ...current])
    setCaseNoteDraft('')
    setNotice('Case note saved to interaction history in this demo session.')
  }

  const selectedNotification = notifications.find((item) => item.id === selectedNotificationId) ?? notifications[0]
  const selectedNotificationFarmer = selectedNotification ? getFarmer(selectedNotification.farmerId) : selectedCase
  const currentConversation = messages[selectedCase.id] ?? []
  const filteredInteractions = interactionRecords.filter((record) => {
    const query = interactionQuery.trim().toLowerCase()
    const farmer = getFarmer(record.farmerId)
    return !query || [farmer.name, record.farmerId, record.type, record.problem, record.advice, record.notes]
      .some((value) => value.toLowerCase().includes(query))
  })
  const pendingConsultations = farmerCases.filter((farmerCase) => ['Awaiting review', 'Under review'].includes(farmerCase.status)).length
  const activeConversations = farmerCases.filter((farmerCase) => (messages[farmerCase.id] ?? []).some((message) => message.sender === 'farmer' && !message.isRead)).length
  const completedConsultations = interactionRecords.filter((record) => record.type === 'Consultation').length
  const pendingFollowUps = farmerCases.filter((farmerCase) => farmerCase.status === 'Follow-up due').length

  /**
   * Renders the coordinator inbox and the selected farmer report.
   * @returns A notification list, report details, and acknowledgement action.
   * @remarks Notifications are demo fixtures held only in this page's React state.
   */
  const renderNotificationCenter = () => (
    <div className="workflow-grid notification-workflow">
      <section className="panel workflow-panel notification-list-panel" aria-label="Coordinator notifications">
        <div className="panel-heading">
          <div>
            <div className="panel-title-row"><h2>Coordinator inbox</h2><span className="queue-count">{notifications.filter((item) => !item.isRead).length} unread</span></div>
            <p>Assignments and farmer reports, demo data</p>
          </div>
        </div>
        <ul className="notification-list">
          {notifications.map((item) => {
            const farmer = getFarmer(item.farmerId)
            return (
              <li key={item.id}>
                <button
                  aria-current={selectedNotificationId === item.id ? 'true' : undefined}
                  className={`notification-item${selectedNotificationId === item.id ? ' notification-item-selected' : ''}`}
                  onClick={() => openNotification(item.id)}
                  type="button"
                >
                  <span className={`notification-unread${item.isRead ? ' notification-unread-hidden' : ''}`} aria-label={item.isRead ? 'Read' : 'Unread'} />
                  <span className="notification-item-copy">
                    <strong>{item.title}</strong>
                    <span>{farmer.name} · {item.category}</span>
                    <time dateTime={item.receivedAt}>{formatDateTime(item.receivedAt)}</time>
                  </span>
                  <span className={`status-chip${item.status === 'Received' ? ' status-chip-success' : ' status-chip-pending'}`}>{item.status}</span>
                </button>
              </li>
            )
          })}
          {notifications.length === 0 && <li className="empty-state">No coordinator notifications are available in this demo.</li>}
        </ul>
      </section>

      <section className="panel workflow-panel notification-detail-panel" aria-label="Selected notification details">
        {selectedNotification ? (
          <>
            <div className="workflow-section-heading">
              <div><span className="small-label">{selectedNotification.category}</span><h2>{selectedNotification.title}</h2></div>
              <span className={`status-chip${selectedNotification.status === 'Received' ? ' status-chip-success' : ' status-chip-pending'}`}>{selectedNotification.status}</span>
            </div>
            <p className="workflow-lead">{selectedNotification.description}</p>
            <div className="workflow-facts">
              <Detail label="Farmer" value={selectedNotificationFarmer.name} />
              <Detail label="Case ID" value={selectedNotificationFarmer.id} />
              <Detail label="Reported problem" value={selectedNotificationFarmer.issue} />
              <Detail label="Crop and location" value={`${selectedNotificationFarmer.crop} · ${selectedNotificationFarmer.location}`} />
            </div>
            <div className="workflow-actions">
              <button
                className="button button-primary"
                disabled={selectedNotification.status === 'Received'}
                onClick={() => acknowledgeNotification(selectedNotification.id)}
                type="button"
              >
                <Icon name="check" /> {selectedNotification.status === 'Received' ? 'Received' : 'Acknowledge'}
              </button>
              <button className="button button-outline" onClick={() => { selectCase(selectedNotificationFarmer); onNavigate('cases') }} type="button">
                View farmer details
              </button>
            </div>
            {selectedNotification.acknowledgedAt && (
              <p className="acknowledgement-stamp" role="status">Received {formatDateTime(selectedNotification.acknowledgedAt)}</p>
            )}
            {notice && <p className="inline-notice" role="status">{notice}</p>}
          </>
        ) : (
          <div className="empty-state">Choose a notification to review its farmer and report details.</div>
        )}
      </section>
    </div>
  )

  /**
   * Renders contact details, farm location, report time, and available evidence.
   * @returns The selected farmer profile with a local interactive coordinate preview.
   * @remarks Photos, recordings, and live map tiles are unavailable in this demo.
   */
  const renderFarmerProfile = () => (
    <div className="farmer-workflow">
      <section className="panel workflow-panel farmer-profile-panel">
        <div className="farmer-identity">
          <div className="farmer-profile-avatar" aria-hidden="true">{selectedCase.initials}</div>
          <div className="farmer-identity-copy">
            <span className="small-label">FARMER PROFILE · DEMO RECORD</span>
            <h2>{selectedCase.name}</h2>
            <p>{selectedCase.crop} farmer · {selectedCase.location}</p>
          </div>
          <label className="workflow-select-label">Farmer
            <select onChange={(event) => selectCase(getFarmer(event.target.value))} value={selectedCase.id}>
              {farmerCases.map((farmerCase) => <option key={farmerCase.id} value={farmerCase.id}>{farmerCase.name}</option>)}
            </select>
          </label>
        </div>
        <div className="workflow-facts">
          <Detail label="Phone" value={selectedCase.phone} />
          <Detail label="Email" value={selectedCase.email} />
          <Detail label="Case ID" value={selectedCase.id} />
          <Detail label="Reported problem" value={selectedCase.issue} />
          <Detail label="Crop and location" value={`${selectedCase.crop} · ${selectedCase.location}`} />
          <Detail label="Report submitted" value={formatDateTime(selectedCase.submittedAt)} />
        </div>
      </section>

      <div className="evidence-grid">
        <section className="panel workflow-panel evidence-panel">
          <div className="panel-heading"><div><h2>Farm location</h2><p>Illustrative coordinates, not a live map</p></div></div>
          <div className={`coordinate-map coordinate-map-zoom-${mapZoom}`} role="img" aria-label={`Illustrative farm location in ${selectedCase.location} at ${selectedCase.coordinates}`}>
            <span className="map-road map-road-one" /><span className="map-road map-road-two" />
            <span className="map-marker"><Icon name="location" /></span>
            <span className="map-caption">{selectedCase.location}</span>
          </div>
          <div className="map-controls">
            <span><Icon name="location" /> {selectedCase.coordinates}</span>
            <div>
              <button aria-label="Zoom out" className="icon-button" disabled={mapZoom === 1} onClick={() => setMapZoom(1)} type="button">−</button>
              <button aria-label="Zoom in" className="icon-button" disabled={mapZoom === 3} onClick={() => setMapZoom((zoom) => Math.min(3, zoom + 1))} type="button">+</button>
            </div>
          </div>
        </section>

        <section className="panel workflow-panel evidence-panel">
          <div className="panel-heading"><div><h2>Farmer submitted evidence</h2><p>{selectedCase.crop} · {selectedCase.issue}</p></div></div>
          <div className="evidence-placeholder" role="status">
            <span className="evidence-placeholder-icon"><Icon name="leaf" /></span>
            <strong>No crop images attached</strong>
            <span>Image evidence is not available in this local demo.</span>
          </div>
          <div className="audio-placeholder" role="status">
            <span className="audio-placeholder-icon"><Icon name="activity" /></span>
            <div><strong>Voice recording unavailable</strong><span>No farmer audio file is included in this demo.</span></div>
          </div>
          <p className="evidence-timestamp"><Icon name="clock" /> Report submitted {formatDateTime(selectedCase.submittedAt)}</p>
        </section>
      </div>
    </div>
  )

  /**
   * Renders farmer conversations and adds specialist replies to local state.
   * @returns A conversation list, timestamped message history, and message form.
   * @remarks Sending only changes the demo session and never contacts a farmer.
   */
  const renderCommunicationCenter = () => (
    <div className="chat-workflow panel">
      <aside className="chat-farmer-list" aria-label="Farmer conversations">
        <div className="chat-list-heading"><h2>Conversations</h2><span>{farmerCases.length}</span></div>
        {farmerCases.map((farmerCase) => {
          const farmerMessages = messages[farmerCase.id] ?? []
          const unreadCount = farmerMessages.filter((message) => message.sender === 'farmer' && !message.isRead).length
          return (
            <button
              aria-current={selectedCase.id === farmerCase.id ? 'true' : undefined}
              className={`chat-farmer-item${selectedCase.id === farmerCase.id ? ' chat-farmer-item-active' : ''}`}
              key={farmerCase.id}
              onClick={() => openConversation(farmerCase)}
              type="button"
            >
              <span className="case-avatar case-avatar-sage">{farmerCase.initials}</span>
              <span><strong>{farmerCase.name}</strong><small>{farmerCase.issue}</small></span>
              {unreadCount > 0 && <span className="chat-unread-badge" aria-label={`${unreadCount} unread messages`}>{unreadCount}</span>}
            </button>
          )
        })}
      </aside>
      <section className="chat-conversation" aria-label={`Conversation with ${selectedCase.name}`}>
        <header className="chat-header">
          <div className="case-avatar case-avatar-sage">{selectedCase.initials}</div>
          <div><h2>{selectedCase.name}</h2><span>{selectedCase.id} · {selectedCase.issue}</span></div>
          <span className="demo-label">Demo conversation</span>
        </header>
        <ol className="chat-message-list" aria-live="polite">
          {currentConversation.map((message) => (
            <li className={`chat-message chat-message-${message.sender}`} key={message.id}>
              <p>{message.text}</p>
              <time dateTime={message.sentAt}>{formatDateTime(message.sentAt)}</time>
            </li>
          ))}
          {currentConversation.length === 0 && <li className="empty-state">No messages yet. Send a note to start this demo conversation.</li>}
        </ol>
        <form className="chat-compose" onSubmit={sendMessage}>
          <label className="sr-only" htmlFor="message-draft">Message to {selectedCase.name}</label>
          <textarea id="message-draft" onChange={(event) => setMessageDraft(event.target.value)} placeholder="Write advice or ask for more information..." required value={messageDraft} />
          <div className="chat-compose-actions">
            <button className="text-button" onClick={() => setMessageDraft('Please share a clear close up image of the affected leaves.')} type="button">Request a photo</button>
            <button className="button button-primary" disabled={!messageDraft.trim()} type="submit"><Icon name="chat" /> Add message</button>
          </div>
        </form>
      </section>
    </div>
  )

  /**
   * Renders the illustrative assessment and specialist approval boundary.
   * @returns A conservative suggestion panel with uncertainty and product label states.
   * @remarks This screen does not generate a diagnosis or verified chemical instructions.
   */
  const renderRecommendations = () => {
    const needsMoreEvidence = selectedCase.confidence < 80
    return (
      <div className="recommendation-workflow">
        <section className="panel workflow-panel recommendation-context">
          <div className="panel-heading"><div><h2>Case evidence</h2><p>{selectedCase.name} · {selectedCase.id}</p></div><span className="demo-label">Illustrative assessment</span></div>
          <div className="recommendation-facts">
            <Detail label="Crop" value={selectedCase.crop} />
            <Detail label="Reported problem" value={selectedCase.issue} />
            <Detail label="Farmer description" value="No voice recording or written description is attached to this demo case." />
            <Detail label="Crop images" value="No farmer submitted images are available in this demo." />
            <Detail label="Assessment confidence" value={`${selectedCase.confidence}% · not a verified diagnosis`} />
          </div>
        </section>

        {needsMoreEvidence ? (
          <section className="recommendation-warning" role="status">
            <span className="alert-marker marker-amber"><Icon name="alert" /></span>
            <div><strong>Additional information required</strong><p>The illustrative assessment is uncertain. Request clearer crop images and field observations before suggesting a treatment.</p></div>
          </section>
        ) : (
          <section className="panel workflow-panel recommendation-card">
            <div className="recommendation-heading"><span className="treatment-symbol"><Icon name="leaf" /></span><div><span className="small-label">SPECIALIST REVIEW REQUIRED</span><h2>Integrated pest management</h2><p>A non chemical starting point for specialist review, not an AI generated treatment.</p></div></div>
            <div className="recommendation-fields">
              <Detail label="Chemical product" value="Not provided. Product catalogue is not connected." />
              <Detail label="Active ingredient" value="Not available. Do not infer from this demo." />
              <Detail label="Intended use" value="Review field evidence and consider non chemical controls first." />
              <Detail label="Dosage and application" value="Not available. Follow only the locally registered product label." />
              <Detail label="Safety precautions" value="Verify protective equipment, re entry interval, pre harvest interval, and local registration on the product label." />
              <Detail label="Alternative" value="Request additional evidence and review crop specific cultural controls." />
            </div>
            <div className="label-safety-note"><strong>Product label required.</strong> This prototype contains no verified product, ingredient, dosage, or application instructions.</div>
            <div className="workflow-actions">
              <button className="button button-primary" disabled={Boolean(approvedRecommendationAt)} onClick={approveRecommendation} type="button">
                <Icon name="check" /> {approvedRecommendationAt ? 'Approved in this session' : 'Approve guidance'}
              </button>
              <button className="button button-outline" onClick={() => onNavigate('communication')} type="button"><Icon name="chat" /> Open farmer conversation</button>
            </div>
            {approvedRecommendationAt && <p className="acknowledgement-stamp" role="status">Approved {formatDateTime(approvedRecommendationAt)}. Nothing was sent to the farmer.</p>}
          </section>
        )}
      </div>
    )
  }

  /**
   * Renders the interaction editor and searchable history for the selected farmer.
   * @returns A form and previous records, with an Edit action for every record.
   * @remarks All created and edited entries stay in this browser session.
   */
  const renderInteractionRecords = () => (
    <div className="interaction-workflow">
      <section className="panel workflow-panel interaction-form-panel">
        <div className="panel-heading"><div><h2>{editingInteractionId ? 'Edit interaction' : 'Record an interaction'}</h2><p>{selectedCase.name} · {selectedCase.id}</p></div></div>
        <form className="interaction-form" onSubmit={saveInteraction}>
          <label>Farmer
            <select onChange={(event) => selectCase(getFarmer(event.target.value))} value={selectedCase.id}>
              {farmerCases.map((farmerCase) => <option key={farmerCase.id} value={farmerCase.id}>{farmerCase.name} · {farmerCase.id}</option>)}
            </select>
          </label>
          <label>Date and time<input onChange={(event) => setInteractionDraft((current) => ({ ...current, occurredAt: event.target.value }))} required type="datetime-local" value={interactionDraft.occurredAt} /></label>
          <label>Interaction type
            <select onChange={(event) => setInteractionDraft((current) => ({ ...current, type: event.target.value as InteractionType }))} value={interactionDraft.type}>
              <option>Chat</option><option>Phone call</option><option>Farm visit</option><option>Consultation</option>
            </select>
          </label>
          <label>Reported agricultural problem<input onChange={(event) => setInteractionDraft((current) => ({ ...current, problem: event.target.value }))} required value={interactionDraft.problem} /></label>
          <label>Observations and findings<textarea onChange={(event) => setInteractionDraft((current) => ({ ...current, observations: event.target.value }))} value={interactionDraft.observations} /></label>
          <label>AI recommendation, if applicable<textarea onChange={(event) => setInteractionDraft((current) => ({ ...current, recommendation: event.target.value }))} value={interactionDraft.recommendation} /></label>
          <label>Chemicals or treatments recommended<textarea onChange={(event) => setInteractionDraft((current) => ({ ...current, treatment: event.target.value }))} value={interactionDraft.treatment} /></label>
          <label>Advice given<textarea onChange={(event) => setInteractionDraft((current) => ({ ...current, advice: event.target.value }))} value={interactionDraft.advice} /></label>
          <label>Follow up required<textarea onChange={(event) => setInteractionDraft((current) => ({ ...current, followUp: event.target.value }))} value={interactionDraft.followUp} /></label>
          <label>Specialist notes<textarea onChange={(event) => setInteractionDraft((current) => ({ ...current, notes: event.target.value }))} value={interactionDraft.notes} /></label>
          <div className="interaction-form-actions">
            <button className="button button-primary" type="submit"><Icon name="check" /> {editingInteractionId ? 'Save changes' : 'Save interaction'}</button>
            {editingInteractionId && <button className="button button-outline" onClick={() => { setEditingInteractionId(''); setInteractionDraft({ occurredAt: new Date().toISOString().slice(0, 16), type: 'Consultation', problem: '', observations: '', recommendation: '', treatment: '', advice: '', followUp: '', notes: '' }) }} type="button">Cancel edit</button>}
          </div>
        </form>
      </section>

      <section className="panel workflow-panel interaction-history-panel">
        <div className="panel-heading"><div><h2>Interaction history</h2><p>{filteredInteractions.length} matching records</p></div></div>
        <label className="interaction-search"><span>Search history</span><input onChange={(event) => setInteractionQuery(event.target.value)} placeholder="Farmer, case ID, type, problem..." value={interactionQuery} /></label>
        <ol className="interaction-history-list">
          {filteredInteractions.map((record) => {
            const farmer = getFarmer(record.farmerId)
            return (
              <li className="interaction-history-item" key={record.id}>
                <div className="interaction-record-heading"><div><strong>{record.type} · {farmer.name}</strong><span>{record.farmerId} · {formatDateTime(record.occurredAt)}</span></div><button className="button button-outline" onClick={() => editInteraction(record)} type="button">Edit</button></div>
                <dl className="interaction-record-details">
                  <div><dt>Reported problem</dt><dd>{record.problem}</dd></div>
                  <div><dt>Observations</dt><dd>{record.observations || 'None recorded'}</dd></div>
                  <div><dt>Recommendation</dt><dd>{record.recommendation || 'None recorded'}</dd></div>
                  <div><dt>Treatment</dt><dd>{record.treatment || 'None recorded'}</dd></div>
                  <div><dt>Advice</dt><dd>{record.advice || 'None recorded'}</dd></div>
                  <div><dt>Follow up</dt><dd>{record.followUp || 'None recorded'}</dd></div>
                  <div><dt>Specialist notes</dt><dd>{record.notes || 'None recorded'}</dd></div>
                </dl>
              </li>
            )
          })}
          {filteredInteractions.length === 0 && <li className="empty-state">No interaction records match this search.</li>}
        </ol>
      </section>
    </div>
  )

  const workflowContent = activeSection === 'intelligence'
    ? { title: 'Coordinator notifications', subtitle: 'Review assignments and farmer reports, then acknowledge receipt.', content: renderNotificationCenter() }
    : activeSection === 'cases'
      ? { title: 'Farmer details and evidence', subtitle: 'Review contact details, farm location, and the evidence available for each report.', content: renderFarmerProfile() }
      : activeSection === 'communication'
        ? { title: 'Farmer communication', subtitle: 'Keep case conversations together and record local demo replies.', content: renderCommunicationCenter() }
        : activeSection === 'treatments'
          ? { title: 'Treatment review', subtitle: 'Review uncertain assessments and approve cautious guidance before any farmer sharing.', content: renderRecommendations() }
          : activeSection === 'records'
            ? { title: 'Interaction records', subtitle: 'Document, search, and update specialist interactions.', content: renderInteractionRecords() }
            : null

  // Keep the new workflows inside the existing dashboard shell and its sidebar navigation.
  if (workflowContent) {
    return (
      <div className="command-centre workflow-page" data-section={activeSection}>
        <div className="page-heading workflow-page-heading">
          <div>
            <div className="heading-kicker"><span className="heading-kicker-dot" /> SPECIALIST WORKSPACE</div>
            <h1>{workflowContent.title}</h1>
            <p>{workflowContent.subtitle}</p>
          </div>
          <span className="demo-label"><span /> Illustrative data</span>
        </div>
        {workflowContent.content}
        <footer className="page-footer">
          <span><Icon name="shield" /> Crop Guard AI · Specialist workspace</span>
          <span>All changes on this screen are local to the current demo session.</span>
        </footer>
      </div>
    )
  }

  return (
    <div className="command-centre" data-section={activeSection}>
      <div className="page-heading">
        <div>
          <div className="heading-kicker"><span className="heading-kicker-dot" /> {new Date().toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</div>
          <h1>{showConsultation ? 'Farmer consultation workspace' : 'Specialist Command Centre'}</h1>
          <p>Assigned Extension Officer: <strong>Dr. Sarah Mwangi</strong><span className="heading-separator">·</span> Station: Rift Valley Agricultural Research Station</p>
        </div>
        <div className="heading-actions">
          <span className="demo-label"><span /> Illustrative data</span>
          <button className="button button-primary resume-button" onClick={onOpenConsultation} type="button">
            <Icon name="cases" />
            Resume last consultation <span className="resume-case-id">#{selectedCase.id}</span>
          </button>
        </div>
      </div>

      {/* These six summary cards use the same local records shown in the workspace below. */}
      <section aria-label="Specialist workload summary" className="stats-grid">
        <article className="stat-card">
          <div className="stat-top"><span>Assigned farmers</span><span className="stat-icon stat-icon-green"><Icon name="cases" /></span></div>
          <div className="stat-value">{farmerCases.length}</div>
          <div className="stat-foot"><span className="stat-trend">All assigned to you</span></div>
        </article>
        <article className="stat-card">
          <div className="stat-top"><span>New farmer reports</span><span className="stat-icon stat-icon-red"><Icon name="alert" /></span></div>
          <div className="stat-value stat-red">{notifications.filter((item) => item.category === 'Disease report' || item.category === 'Pest infestation').length}</div>
          <div className="stat-foot"><span className="stat-alert-text">Coordinator reports</span></div>
        </article>
        <article className="stat-card">
          <div className="stat-top"><span>Pending consultations</span><span className="stat-icon stat-icon-amber"><Icon name="clock" /></span></div>
          <div className="stat-value">{pendingConsultations}</div>
          <div className="stat-foot"><span className="stat-muted">Awaiting specialist review</span></div>
        </article>
        <article className="stat-card">
          <div className="stat-top"><span>Active conversations</span><span className="stat-icon stat-icon-green"><Icon name="chat" /></span></div>
          <div className="stat-value">{activeConversations}</div>
          <div className="stat-foot"><span className="stat-trend">With unread farmer messages</span></div>
        </article>
        <article className="stat-card">
          <div className="stat-top"><span>Completed consultations</span><span className="stat-icon stat-icon-green"><Icon name="check" /></span></div>
          <div className="stat-value">{completedConsultations}</div>
          <div className="stat-foot"><span className="stat-trend">Recorded interactions</span></div>
        </article>
        <article className="stat-card">
          <div className="stat-top"><span>Pending follow-ups</span><span className="stat-icon stat-icon-amber"><Icon name="calendar" /></span></div>
          <div className="stat-value stat-amber">{pendingFollowUps}</div>
          <div className="stat-foot"><span className="stat-muted">Progress evaluation needed</span></div>
        </article>
      </section>

      {/* The case queue and selected consultation remain the dashboard's main working area. */}
      <div className="workbench-grid">
        <section className="panel case-queue">
          <div className="panel-heading">
            <div>
              <div className="panel-title-row"><h2>Priority case queue</h2><span className="queue-count">3</span></div>
              <p>Cases awaiting specialist review</p>
            </div>
            <button className="text-button" onClick={onOpenConsultation} type="button">Open consultation <span>→</span></button>
          </div>
          <div className="queue-toolbar">
            <label className="queue-search">
              <Icon name="search" />
              <input
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search assigned cases..."
                value={searchQuery}
              />
            </label>
            <button
              aria-pressed={urgentOnly}
              className={`filter-button${urgentOnly ? ' filter-button-active' : ''}`}
              onClick={() => setUrgentOnly(!urgentOnly)}
              type="button"
            >
              <Icon name="filter" /> {urgentOnly ? 'Urgent only' : 'Filters'}
            </button>
          </div>
          <div className="case-list">
            {visibleCases.map((farmerCase) => (
              <button
                aria-pressed={selectedCase.id === farmerCase.id}
                className={`case-row${selectedCase.id === farmerCase.id ? ' case-row-selected' : ''}`}
                key={farmerCase.id}
                onClick={() => selectCase(farmerCase)}
                type="button"
              >
                <span className={`case-avatar case-avatar-${farmerCase.color}`}>{farmerCase.initials}</span>
                <span className="case-main">
                  <span className="case-name-line">
                    <strong>{farmerCase.name}</strong>
                    <span className="case-id">{farmerCase.id}</span>
                  </span>
                  <span className="case-detail">{farmerCase.location} <i /> {farmerCase.crop} <i /> {farmerCase.issue}</span>
                  <span className="case-tags">
                    <span className="ai-tag"><Icon name="spark" /> AI {farmerCase.confidence}%</span>
                    <span className={`severity severity-${farmerCase.severity.toLowerCase()}`}>{farmerCase.severity}</span>
                    <span className="case-status">{farmerCase.status}</span>
                  </span>
                </span>
                <Icon className="case-chevron" name="chevron" />
              </button>
            ))}
            {visibleCases.length === 0 && (
              <div className="empty-state">No assigned cases match “{searchQuery}”. Try a farmer, crop, case ID or location.</div>
            )}
          </div>
          <div className="queue-footer">
            <span>Showing {visibleCases.length} of 3 assigned cases</span>
            <button
              className="subtle-link"
              onClick={() => { onSearchChange(''); setUrgentOnly(false) }}
              type="button"
            >
              Clear filters
            </button>
          </div>
        </section>

        <section className={`consultation-card${showConsultation ? ' consultation-expanded' : ''}`}>
          <div className="consultation-card-heading">
            <div className="consultation-heading-label"><span className="live-dot" /> {showConsultation ? 'UNIFIED CONSULTATION WORKSPACE' : 'ACTIVE CONSULTATION'}</div>
            <span className="priority-badge"><span /> High priority</span>
          </div>
          <h2>{selectedCase.name} <span>—</span> {selectedCase.crop}</h2>
          <p className="consultation-diagnosis">AI-identified {selectedCase.issue} with {selectedCase.confidence}% confidence. Field loss risk is currently assessed as {selectedCase.severity.toLowerCase()}.</p>
          <div className="consultation-meta">
            <span><Icon name="location" /> {selectedCase.location}</span>
            <span><Icon name="clock" /> Case opened 2h ago</span>
          </div>
          <div className="consultation-divider" />
          <div className="tab-list" role="tablist" aria-label="Farmer consultation sections">
            {workspaceTabs.map((tab) => (
              <button
                aria-selected={activeTab === tab}
                className={`workspace-tab${activeTab === tab ? ' workspace-tab-active' : ''}`}
                key={tab}
                onClick={() => { setActiveTab(tab); setNotice('') }}
                role="tab"
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
          <div aria-live="polite" className="workspace-content" role="tabpanel">
            {activeTab === 'AI diagnosis' && (
              <div className="diagnosis-view">
                <div className="diagnosis-image">
                  <div className="leaf-illustration"><Icon name="leaf" /></div>
                  <span className="image-quality"><span /> Image quality: good</span>
                </div>
                <div className="diagnosis-details">
                  <span className="small-label">AI INITIAL ASSESSMENT</span>
                  <h3>{selectedCase.issue}</h3>
                  <p>AI findings are an initial assessment. Review the evidence and record your professional diagnosis separately.</p>
                  <div className="confidence-line"><span>Model confidence</span><strong>{selectedCase.confidence}%</strong></div>
                  <div className="confidence-track"><span style={{ width: `${selectedCase.confidence}%` }} /></div>
                  <div className="diagnosis-actions">
                    <button className={`button button-confirm${diagnosisDecision === 'confirmed' ? ' button-selected' : ''}`} onClick={() => markDecision('confirmed')} type="button">
                      <Icon name="check" /> Confirm finding
                    </button>
                    <button className={`button button-outline${diagnosisDecision === 'overridden' ? ' button-selected-outline' : ''}`} onClick={() => markDecision('overridden')} type="button">
                      Override
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'Farm profile' && (
              <div className="tab-detail-grid">
                <Detail label="Farmer" value={selectedCase.name} />
                <Detail label="Crop & growth stage" value={`${selectedCase.crop} · Vegetative`} />
                <Detail label="Farm size" value="2.4 acres" />
                <Detail label="Farm location" value={selectedCase.location} />
                <Detail label="GPS coordinates" value="0.3031° S, 36.0800° E" />
                <Detail label="Previous cases" value="1 resolved case" />
              </div>
            )}
            {activeTab === 'Expert advice' && (
              <div className="form-panel">
                <div className="decision-banner">
                  <span className={`decision-icon decision-${diagnosisDecision}`}><Icon name={diagnosisDecision === 'overridden' ? 'alert' : 'check'} /></span>
                  <div><strong>{diagnosisDecision === 'pending' ? 'Specialist diagnosis not recorded' : `AI finding ${diagnosisDecision}`}</strong><span>Professional decision is tracked separately from AI output.</span></div>
                </div>
                <label className="form-label">Specialist diagnosis & field observations<textarea onChange={(event) => setCaseNoteDraft(event.target.value)} placeholder="Enter your verified diagnosis, observations, and advice for the farmer..." value={caseNoteDraft} /></label>
                <button className="button button-primary" onClick={saveCaseNote} type="button">Save case note</button>
              </div>
            )}
            {activeTab === 'Treatments' && (
              <div className="treatment-summary">
                <div className="treatment-symbol"><Icon name="leaf" /></div>
                <div><span className="small-label">TREATMENT RECOMMENDATION</span><h3>Integrated pest management</h3><p>Confirm the product, dosage and safety instructions with the local agricultural catalogue before recommendation.</p></div>
                <span className="stock-status">Availability unverified</span>
              </div>
            )}
            {activeTab === 'Farm visit' && (
              <div className="visit-summary">
                <div className="visit-date"><strong>06</strong><span>NOV</span></div>
                <div className="visit-copy"><span className="small-label">NEXT SCHEDULED VISIT</span><h3>Tomorrow · 10:00 AM</h3><p><Icon name="location" /> {selectedCase.location} · Field inspection checklist pending</p>{visitDetailsOpen && <div className="visit-detail-expanded" id="visit-detail-expanded"><Detail label="Farmer" value={selectedCase.name} /><Detail label="Case" value={selectedCase.id} /><Detail label="Visit purpose" value="Crop health field inspection" /></div>}</div>
                <button aria-controls="visit-detail-expanded" aria-expanded={visitDetailsOpen} className="button button-outline" onClick={() => setVisitDetailsOpen(!visitDetailsOpen)} type="button">{visitDetailsOpen ? 'Hide visit' : 'View visit'}</button>
              </div>
            )}
            {activeTab === 'Communication' && (
              <div className="communication-preview">
                <div className="communication-avatar">{selectedCase.initials}</div>
                <div className="communication-copy"><span className="small-label">LAST MESSAGE · 10:42 AM</span><p>“I have uploaded the latest crop photos. Please let me know what I should do next.”</p><span>Farmer · In-app message · demo conversation</span></div>
                <button className="button button-primary" onClick={() => onNavigate('communication')} type="button"><Icon name="chat" /> Reply</button>
              </div>
            )}
            {activeTab === 'Case records' && (
              <div className="timeline">
                <div className="timeline-item"><span className="timeline-dot timeline-green" /><div><strong>Case assigned to Dr. Sarah Mwangi</strong><span>Today · 10:30 AM</span></div></div>
                <div className="timeline-item"><span className="timeline-dot timeline-blue" /><div><strong>AI assessment completed · {selectedCase.confidence}% confidence</strong><span>Today · 10:16 AM</span></div></div>
                <div className="timeline-item"><span className="timeline-dot timeline-gray" /><div><strong>Farmer submitted crop images and voice note</strong><span>Today · 10:02 AM</span></div></div>
              </div>
            )}
          </div>
          {notice && <div className="inline-notice" role="status">{notice}</div>}
          <div className="consultation-footer">
            <span><Icon name="activity" /> Case status: <strong>{diagnosisDecision === 'pending' ? selectedCase.status : 'Under review'}</strong></span>
            <button className="subtle-link" onClick={() => setActiveTab('Case records')} type="button">View case activity <span>→</span></button>
          </div>
        </section>
      </div>

      <div className="context-grid">
        <section className="panel alert-panel">
          <div className="panel-heading compact-heading">
            <div><div className="panel-title-row"><h2>Disease & field alerts</h2><span className="alert-count">2</span></div><p>Regional intelligence for your area</p></div>
            <button aria-label="Open coordinator notifications" className="icon-button panel-more" onClick={() => onNavigate('intelligence')} type="button"><Icon name="more" /></button>
          </div>
          <div className="alert-row">
            <span className="alert-marker marker-red"><Icon name="alert" /></span>
            <div><strong>Fall armyworm activity rising</strong><p>Nakuru North · 3 reports in the last 24 hours</p></div>
            <span className="alert-severity">High</span>
          </div>
          <div className="alert-row">
            <span className="alert-marker marker-amber"><Icon name="activity" /></span>
            <div><strong>Maize moisture stress advisory</strong><p>Rift Valley · Dry spell expected this week</p></div>
            <span className="alert-severity alert-severity-amber">Advisory</span>
          </div>
        </section>

        <section className="panel visits-panel">
          <div className="panel-heading compact-heading">
            <div><h2>Upcoming farm visits</h2><p>Your next field appointments</p></div>
            <button className="text-button" onClick={() => onNavigate('visits')} type="button">View schedule <span>→</span></button>
          </div>
          <div className="upcoming-visit">
            <div className="visit-date-small"><strong>06</strong><span>NOV</span></div>
            <div className="upcoming-visit-copy"><strong>Grace Achieng <span className="visit-time">10:00 AM</span></strong><p><Icon name="location" /> Kisumu County · Maize field inspection</p></div>
            <span className="visit-confirmed">Confirmed</span>
          </div>
        </section>
      </div>

      {/* Recent activity links take the specialist directly to the matching workflow. */}
      <section className="panel recent-activity-panel">
        <div className="panel-heading">
          <div><h2>Recent activity</h2><p>Latest reports, coordinator messages, records, and conversations</p></div>
        </div>
        <div className="activity-grid">
          <section className="activity-group" aria-label="Latest farmer reports">
            <h3>Farmer reports</h3>
            {farmerCases.slice(0, 2).map((farmerCase) => (
              <button className="activity-item" key={farmerCase.id} onClick={() => { selectCase(farmerCase); onNavigate('cases') }} type="button">
                <span className="activity-marker activity-marker-green"><Icon name="leaf" /></span>
                <span><strong>{farmerCase.issue}</strong><small>{farmerCase.name} · {formatDateTime(farmerCase.submittedAt)}</small></span>
              </button>
            ))}
          </section>
          <section className="activity-group" aria-label="Coordinator notifications">
            <h3>Coordinator notifications</h3>
            {notifications.slice(0, 2).map((item) => (
              <button className="activity-item" key={item.id} onClick={() => openNotification(item.id)} type="button">
                <span className="activity-marker activity-marker-amber"><Icon name="alert" /></span>
                <span><strong>{item.title}</strong><small>{item.status} · {getFarmer(item.farmerId).name}</small></span>
              </button>
            ))}
          </section>
          <section className="activity-group" aria-label="Recent specialist interactions">
            <h3>Specialist interactions</h3>
            {interactionRecords.slice(0, 2).map((record) => (
              <button className="activity-item" key={record.id} onClick={() => onNavigate('records')} type="button">
                <span className="activity-marker activity-marker-blue"><Icon name="activity" /></span>
                <span><strong>{record.type} · {getFarmer(record.farmerId).name}</strong><small>{record.problem} · {formatDateTime(record.occurredAt)}</small></span>
              </button>
            ))}
          </section>
          <section className="activity-group" aria-label="Recent farmer conversations">
            <h3>Farmer conversations</h3>
            {farmerCases.map((farmerCase) => ({ farmerCase, lastMessage: messages[farmerCase.id]?.at(-1) }))
              .filter(({ lastMessage }) => lastMessage)
              .slice(0, 2)
              .map(({ farmerCase, lastMessage }) => (
                <button className="activity-item" key={farmerCase.id} onClick={() => { openConversation(farmerCase); onNavigate('communication') }} type="button">
                  <span className="activity-marker activity-marker-green"><Icon name="chat" /></span>
                  <span><strong>{farmerCase.name}</strong><small>{lastMessage?.text} · {formatDateTime(lastMessage?.sentAt ?? '')}</small></span>
                </button>
              ))}
          </section>
        </div>
      </section>

      <footer className="page-footer">
        <span><Icon name="shield" /> Crop Guard AI · Specialist workspace</span>
        <span>Demo values are illustrative and are not live agricultural records.</span>
      </footer>
    </div>
  )
}

/**
 * Shows one labeled value in the farmer and interaction detail panels.
 * @param props `label` is the field name and `value` is its displayed content.
 * @returns A compact detail row used by the dashboard workflow panels.
 * @remarks The farmer profile, notifications, and recommendation panels reuse it.
 */
function Detail({ label, value }: { label: string; value: string }) {
  return <div className="detail-item"><span>{label}</span><strong>{value}</strong></div>
}

export default CommandCentre
