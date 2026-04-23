const admin = require('firebase-admin');

let db;

/** Lazy-initialise Firebase Admin + Firestore. */
function initializeFirestore() {
  if (!admin.apps.length) {
    try {
      // On Cloud Run, ADC is automatic.
      // Locally, set GOOGLE_APPLICATION_CREDENTIALS env var.
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      db = admin.firestore();
    } catch (error) {
      console.warn('⚠️ Firestore initialization failed (missing serviceAccountKey.json?). Database operations will fail, but Gemini will still work.');
      console.error(error.message);
    }
  } else {
    db = admin.firestore();
  }
}

function getDb() {
  if (!db) initializeFirestore();
  return db; // May still be undefined if initialization failed
}

// ──────────────────────────────────────────────
// Reports
// ──────────────────────────────────────────────

/**
 * Save a full report document to Firestore.
 * Uses the report.id as the document ID.
 */
async function saveReport(report) {
  const database = getDb();
  if (!database) {
    console.warn('⚠️ Mock mode: Report not saved because Firestore is not configured.');
    return report;
  }
  
  const docRef = database.collection('reports').doc(report.id);
  await docRef.set({
    ...report,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return report;
}

/**
 * Retrieve a single report by ID.
 * Converts Firestore Timestamps to ISO strings.
 */
async function getReport(id) {
  const database = getDb();
  if (!database) return null;

  const doc = await database.collection('reports').doc(id).get();
  if (!doc.exists) return null;

  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt && typeof data.createdAt.toDate === 'function'
      ? data.createdAt.toDate().toISOString()
      : data.createdAt,
  };
}

/**
 * List all reports (latest first), returning a summary projection.
 */
async function listReports() {
  const database = getDb();
  if (!database) return []; // Return empty history if DB not configured

  const snapshot = await database
    .collection('reports')
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      overallScore: data.overallScore,
      riskLevel: data.riskLevel,
      segmentCount: data.segments?.length ?? 0,
      rawDescription:
        data.rawDescription?.length > 150
          ? data.rawDescription.substring(0, 150) + '…'
          : data.rawDescription,
      createdAt: data.createdAt && typeof data.createdAt.toDate === 'function'
        ? data.createdAt.toDate().toISOString()
        : data.createdAt,
    };
  });
}

// ──────────────────────────────────────────────
// Chat messages (subcollection under reports)
// ──────────────────────────────────────────────

async function saveChatMessage(reportId, message) {
  const database = getDb();
  if (!database) return; // Silent return if DB not configured

  await database
    .collection('reports')
    .doc(reportId)
    .collection('chatMessages')
    .add({
      ...message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
}

module.exports = { saveReport, getReport, listReports, saveChatMessage, initializeFirestore };
