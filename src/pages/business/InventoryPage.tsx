import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { InventoryItem, InventoryMovement, Booking } from '../../types';
import { QRCodeView } from '../../components/common/QRCodeView';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  QrCode,
  Trash2,
  Edit,
  History,
  X,
  AlertTriangle,
  Package,
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [unitFilter, setUnitFilter] = useState<string>('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showMovementModal, setShowMovementModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [selectedItemForMovement, setSelectedItemForMovement] = useState<InventoryItem | null>(null);
  const [qrModalUnit, setQrModalUnit] = useState<string | null>(null);

  // Add Item Form State
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemSku, setNewItemSku] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<string>('Electronics');
  const [newItemQuantity, setNewItemQuantity] = useState<number>(50);
  const [newItemUnit, setNewItemUnit] = useState<string>('Cartons');
  const [newItemValue, setNewItemValue] = useState<number>(1000);
  const [newItemNotes, setNewItemNotes] = useState<string>('');
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');

  // Stock Movement Form State
  const [movementType, setMovementType] = useState<'IN' | 'OUT' | 'ADJUSTMENT'>('OUT');
  const [movementQty, setMovementQty] = useState<number>(10);
  const [movementNotes, setMovementNotes] = useState<string>('');
  const [movementError, setMovementError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [invRes, movRes, bRes] = await Promise.all([
        api.getInventory(user?.id),
        api.getInventoryMovements(user?.id),
        api.getBookings({ businessId: user?.id }),
      ]);
      setItems(invRes.items || []);
      setMovements(movRes.movements || []);
      setBookings(bRes.bookings || []);
      if (bRes.bookings && bRes.bookings.length > 0) {
        setSelectedBookingId(bRes.bookings[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newItemName) return;

    const booking = bookings.find(b => b.id === selectedBookingId) || bookings[0];

    try {
      const sku = newItemSku || `SKU-${Date.now().toString().slice(-6)}`;
      await api.addInventoryItem({
        businessId: user.id,
        storageUnitId: booking ? booking.storageUnitId : 'unit_mer_b17',
        unitCode: booking ? booking.unitCode : 'MER-04-B17',
        propertyId: booking ? booking.propertyId : 'prop_meerut_1',
        propertyName: booking ? booking.propertyName : 'Meerut Central Logistics Hub',
        sku,
        productName: newItemName,
        category: newItemCategory,
        quantity: Number(newItemQuantity),
        unit: newItemUnit,
        unitValue: Number(newItemValue),
        notes: newItemNotes,
      });

      setShowAddModal(false);
      setNewItemName('');
      setNewItemSku('');
      setNewItemNotes('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecordMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForMovement || !user?.id) return;

    setMovementError(null);
    if (movementType === 'OUT' && selectedItemForMovement.quantity < movementQty) {
      setMovementError(`Cannot dispatch ${movementQty}. Only ${selectedItemForMovement.quantity} in stock.`);
      return;
    }

    try {
      await api.recordInventoryMovement({
        inventoryItemId: selectedItemForMovement.id,
        businessId: user.id,
        movementType,
        quantity: movementQty,
        notes: movementNotes || `${movementType} movement recorded`,
      });

      setShowMovementModal(false);
      setMovementNotes('');
      loadData();
    } catch (err: any) {
      setMovementError(err.message || 'Failed to record movement');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Delete this inventory item from storage records?')) {
      await api.deleteInventoryItem(id);
      loadData();
    }
  };

  // Filter items
  const filteredItems = items.filter(item => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        item.productName.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (unitFilter !== 'All' && item.unitCode !== unitFilter) return false;
    return true;
  });

  const totalValue = items.reduce((sum, i) => sum + i.totalValue, 0);
  const totalUnitsCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
            Stock & Warehousing
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Business Inventory Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time SKU balances, bay allocations, inward/outward movement history, and unit QR tags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistoryModal(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-slate-600" />
            Movement Log ({movements.length})
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Inward New Stock
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total SKUs</span>
          <p className="text-xl font-bold text-slate-900">{items.length}</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Cargo Units</span>
          <p className="text-xl font-bold text-indigo-600">{totalUnitsCount.toLocaleString('en-IN')}</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Inventory Value</span>
          <p className="text-xl font-bold text-emerald-600">₹{totalValue.toLocaleString('en-IN')}</p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Active Storage Bays</span>
          <p className="text-xl font-bold text-slate-900">{bookings.length || 1}</p>
        </div>
      </div>

      {/* Search and Filters Bar (#15) */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search product name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="FMCG">FMCG</option>
            <option value="Garments">Garments</option>
            <option value="Packaging">Packaging</option>
            <option value="Furniture">Furniture</option>
          </select>

          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="All">All Storage Units</option>
            {bookings.map(b => (
              <option key={b.id} value={b.unitCode}>{b.unitCode} ({b.propertyName})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table (#15) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">SKU & Item Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Storage Bay Unit</th>
                <th className="py-3 px-4 text-right">In Stock Qty</th>
                <th className="py-3 px-4 text-right">Unit Value</th>
                <th className="py-3 px-4 text-right">Total Value</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">Loading inventory records...</td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No inventory records match your criteria. Click "Inward New Stock" to add items.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] font-bold text-indigo-600 block">{item.sku}</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{item.productName}</span>
                      {item.notes && <span className="text-[10px] text-slate-400">{item.notes}</span>}
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => setQrModalUnit(item.unitCode)}
                        className="inline-flex items-center gap-1 font-mono font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                      >
                        <QrCode className="w-3 h-3 text-indigo-500" />
                        {item.unitCode}
                      </button>
                      <span className="block text-[10px] text-slate-400 mt-0.5 truncate max-w-[140px]">
                        {item.propertyName}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="font-black text-slate-900 text-sm">
                        {item.quantity} {item.unit}
                      </span>
                      {item.lowStockThreshold && item.quantity <= item.lowStockThreshold && (
                        <span className="block text-[10px] text-rose-600 font-bold">Low Stock Warning</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right text-slate-600">
                      ₹{item.unitValue.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ₹{item.totalValue.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedItemForMovement(item);
                            setShowMovementModal(true);
                          }}
                          title="Record Stock Movement (In / Out / Adjustment)"
                          className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-md text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Stock Action
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          title="Delete SKU"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Inventory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" /> Inward New Inventory SKU
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Havells 3-Blade Ceiling Fans Master Box"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank"
                    value={newItemSku}
                    onChange={(e) => setNewItemSku(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="FMCG">FMCG</option>
                    <option value="Garments">Garments</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Furniture">Furniture</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Type</label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Cartons">Cartons</option>
                    <option value="Boxes">Boxes</option>
                    <option value="Pallets">Pallets</option>
                    <option value="Bales">Bales</option>
                    <option value="Units">Units</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Value (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newItemValue}
                    onChange={(e) => setNewItemValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign to Storage Bay</label>
                <select
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {bookings.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.propertyName} (Unit: {b.unitCode} • {b.areaSqFt} sq ft)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Handling Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Fragile glass components. Max 3 layers stack."
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Confirm Inward Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movement Modal (IN / OUT / ADJUSTMENT) */}
      {showMovementModal && selectedItemForMovement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Record Inventory Movement</h3>
                <p className="text-[11px] text-slate-500 font-mono">{selectedItemForMovement.sku} • {selectedItemForMovement.productName}</p>
              </div>
              <button onClick={() => setShowMovementModal(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordMovement} className="p-6 space-y-4 text-xs">
              {movementError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{movementError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Movement Action Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['OUT', 'IN', 'ADJUSTMENT'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMovementType(type)}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-colors ${
                        movementType === type
                          ? type === 'IN'
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                            : type === 'OUT'
                            ? 'bg-rose-50 border-rose-600 text-rose-700'
                            : 'bg-purple-50 border-purple-600 text-purple-700'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {type === 'IN' && 'Inward (+)'}
                      {type === 'OUT' && 'Dispatch (-)'}
                      {type === 'ADJUSTMENT' && 'Audit Count (=)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="text-slate-500">Current Balance:</span>
                <span className="font-black text-slate-900 text-sm">
                  {selectedItemForMovement.quantity} {selectedItemForMovement.unit}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quantity to {movementType === 'IN' ? 'Add' : movementType === 'OUT' ? 'Dispatch' : 'Set As New Total'}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={movementQty}
                  onChange={(e) => setMovementQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reference Reason / Invoice / Order #</label>
                <input
                  type="text"
                  placeholder="e.g. Dispatched for festival sales order #SF-ORD-902"
                  value={movementNotes}
                  onChange={(e) => setMovementNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMovementModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movement History Log Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" /> Complete Inventory Movement Audit Trail
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3">
              {movements.length === 0 ? (
                <p className="text-center py-8 text-slate-400 text-xs">No movements recorded yet.</p>
              ) : (
                movements.map(m => (
                  <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg font-bold text-xs ${
                        m.movementType === 'IN' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {m.movementType}
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-slate-400">{m.sku}</span>
                        <p className="font-bold text-slate-900">{m.productName}</p>
                        <p className="text-[11px] text-slate-500">{m.notes}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-black text-sm ${m.movementType === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {m.movementType === 'IN' ? '+' : '-'}{m.quantity}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(m.timestamp).toLocaleDateString()} {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Pass Modal */}
      {qrModalUnit && (
        <QRCodeView
          unitCode={qrModalUnit}
          propertyName="Assigned Warehouse Bay"
          areaSqFt={250}
          inventory={items}
          movements={movements}
          onClose={() => setQrModalUnit(null)}
        />
      )}
    </div>
  );
};
