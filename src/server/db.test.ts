import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from './db.ts';

test('DatabaseManager: verified properties exist and capacity behaves correctly', () => {
  const verifiedProps = db.getProperties(true);
  assert.ok(verifiedProps.length >= 5, 'Should have at least 5 verified properties');

  const testProp = verifiedProps.find(p => p.id === 'prop_meerut_1');
  assert.ok(testProp, 'Meerut property should exist');

  const initialCapacity = testProp.availableArea;
  assert.ok(initialCapacity > 1000, 'Initial capacity should be available');

  // Create booking for 200 sq ft
  const booking = db.createBooking({
    businessId: 'usr_business_1',
    businessName: 'Sharma Retail',
    businessEmail: 'business@storeflex.demo',
    businessPhone: '+91 98101 23456',
    propertyId: testProp.id,
    propertyName: testProp.name,
    propertyAddress: testProp.address,
    propertyCity: testProp.city,
    ownerId: testProp.ownerId,
    ownerName: testProp.ownerName,
    storageUnitId: 'unit_test',
    unitCode: 'MER-TEST',
    areaSqFt: 200,
    durationMonths: 2,
    startDate: '2026-11-01',
    endDate: '2027-01-01',
    monthlyRate: testProp.pricePerSqFt,
    totalStorageAmount: 200 * testProp.pricePerSqFt * 2,
    platformFeePercent: 20,
    platformFee: 200 * testProp.pricePerSqFt * 2 * 0.2,
    depositAmount: 200 * testProp.pricePerSqFt,
    taxGst: Math.round(200 * testProp.pricePerSqFt * 2 * 0.2 * 0.18),
    totalAmount: 200 * testProp.pricePerSqFt * 2 + 200 * testProp.pricePerSqFt + Math.round(200 * testProp.pricePerSqFt * 2 * 0.2 * 0.18),
    ownerGrossEarnings: 200 * testProp.pricePerSqFt * 2,
    ownerNetPayout: 200 * testProp.pricePerSqFt * 2 * 0.8,
    status: 'Active',
    inventorySummary: 'Electronics inventory',
    termsAccepted: true,
  });

  assert.ok(booking.id);
  assert.ok(booking.bookingNumber.startsWith('SF-2026-'));

  // Capacity should be deducted
  const afterProp = db.getPropertyById(testProp.id);
  assert.equal(afterProp?.availableArea, initialCapacity - 200);

  // When cancelled, capacity should be released
  db.cancelBooking(booking.id);
  const releasedProp = db.getPropertyById(testProp.id);
  assert.equal(releasedProp?.availableArea, initialCapacity);
});

test('Seeded Demo Data: verified presence of all 8 core entities', () => {
  const users = db.getUsers();
  // 1. Businesses
  const businesses = users.filter(u => u.role === 'business');
  assert.ok(businesses.length >= 1, 'Should have seeded business users');
  assert.equal(businesses[0].name, 'Rajesh Sharma');

  // 2. Space owners
  const owners = users.filter(u => u.role === 'owner');
  assert.ok(owners.length >= 1, 'Should have seeded space owners');
  assert.equal(owners[0].name, 'Vikram Malhotra');

  // 3. Admin operations
  const admins = users.filter(u => u.role === 'admin');
  assert.ok(admins.length >= 1, 'Should have seeded admin users');

  // 4. Storage spaces
  const props = db.getProperties(false);
  assert.ok(props.length >= 6, 'Should have at least 6 commercial properties');

  // 5. Inventory
  const inventory = db.getInventory();
  assert.ok(inventory.length >= 3, 'Should have seeded inventory items');

  // 6. Bookings
  const bookings = db.getBookings();
  assert.ok(bookings.length >= 2, 'Should have seeded bookings');

  // 7. Payments & Invoices
  const payments = db.getPayments();
  const invoices = db.getInvoices();
  assert.ok(payments.length >= 2, 'Should have seeded payment records');
  assert.ok(invoices.length >= 2, 'Should have seeded invoices');

  // 8. Notifications
  const notifs = db.getNotifications();
  assert.ok(notifs.length >= 2, 'Should have seeded notifications');
});

test('In-app notification system handles mock email routing', () => {
  const initialNotifs = db.getNotifications('usr_business_1').length;

  const notif = db.createNotification({
    userId: 'usr_business_1',
    title: 'Storage Contract Renewed',
    message: 'Your contract for Unit MER-04-B17 has been renewed.',
    type: 'booking',
    link: '/business/bookings',
  });

  assert.ok(notif.id);
  const afterNotifs = db.getNotifications('usr_business_1');
  assert.equal(afterNotifs.length, initialNotifs + 1);

  db.markNotificationAsRead(notif.id);
  const updated = db.getNotifications('usr_business_1').find(n => n.id === notif.id);
  assert.equal(updated?.isRead, true);
});

