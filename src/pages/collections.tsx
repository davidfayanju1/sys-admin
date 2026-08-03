import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import { Plus, Search, Star, StarOff, Pencil, Trash2, RefreshCw, Eye } from "lucide-react";
import {
  useCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
  useToggleCollectionFeatured,
  type Collection,
  type CreateCollectionPayload,
  type UpdateCollectionPayload,
} from "../hooks/useCollections";
import CollectionFormModal from "../components/collections/CollectionFormModal";
import CollectionDetailDrawer from "../components/collections/CollectionDetailDrawer";
import DeleteConfirmModal from "../components/collections/DeleteConfirmModal";
import Skeleton from "../components/UI/Skeleton";

const SEASON_LABELS: Record<string, string> = {
  SS: "Spring / Summer",
  AW: "Autumn / Winter",
  FW: "Fall / Winter",
  RS: "Resort",
  PF: "Pre-Fall",
  CO: "Cruise",
};

const CollectionsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="border border-black/8">
        <Skeleton className="h-44 w-full" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

const Collections = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);
  const [viewingCollection, setViewingCollection] = useState<Collection | null>(null);

  const { data, isLoading, isFetching } = useCollections(page, 12, search);
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();
  const toggleFeatured = useToggleCollectionFeatured();

  const collections = data?.data ?? [];
  const meta = data?.meta;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const openCreate = () => {
    setEditingCollection(null);
    setFormOpen(true);
  };

  const openEdit = (col: Collection) => {
    setEditingCollection(col);
    setFormOpen(true);
  };

  const openView = (col: Collection) => {
    setViewingCollection(col);
  };

  const handleFormConfirm = (payload: CreateCollectionPayload | UpdateCollectionPayload) => {
    if (editingCollection) {
      updateCollection.mutate(
        { id: editingCollection._id, payload: payload as UpdateCollectionPayload },
        { onSuccess: () => setFormOpen(false) }
      );
    } else {
      createCollection.mutate(payload as CreateCollectionPayload, {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  const handleDelete = () => {
    if (!deletingCollection) return;
    deleteCollection.mutate(deletingCollection._id, {
      onSuccess: () => setDeletingCollection(null),
    });
  };

  const isFormSubmitting = createCollection.isPending || updateCollection.isPending;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight">Collections</h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-black/40 mt-3">
              Manage your fashion collections and seasonal releases
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-xs tracking-widest uppercase hover:bg-black/80 transition shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            New Collection
          </button>
        </div>

        {/* Search + meta */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search collections…"
                className="w-full pl-9 pr-3 py-2 border border-black/10 text-sm font-light focus:outline-none focus:border-black transition"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 border border-black/10 hover:border-black text-xs uppercase tracking-widest text-black/50 hover:text-black transition"
            >
              Search
            </button>
          </form>

          {meta && (
            <p className="text-[10px] uppercase tracking-widest text-black/30">
              {meta.total} collection{meta.total !== 1 ? "s" : ""}
              {isFetching && !isLoading && (
                <RefreshCw className="inline w-3 h-3 ml-2 animate-spin" />
              )}
            </p>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <CollectionsSkeleton />
        ) : collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 bg-black/4 flex items-center justify-center mb-4">
              <Plus className="w-5 h-5 text-black/30" />
            </div>
            <p className="text-sm font-light text-black/50">No collections found</p>
            <p className="text-[10px] text-black/30 mt-1 uppercase tracking-widest">
              {search ? "Try a different search" : "Create your first collection"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((col) => (
              <CollectionCard
                key={col._id}
                collection={col}
                onView={() => openView(col)}
                onEdit={() => openEdit(col)}
                onDelete={() => setDeletingCollection(col)}
                onToggleFeatured={() => toggleFeatured.mutate(col._id)}
                isTogglingFeatured={toggleFeatured.isPending}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={!meta.hasPrev}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border border-black/10 text-xs uppercase tracking-widest text-black/50 hover:border-black hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-[10px] uppercase tracking-widest text-black/30">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              disabled={!meta.hasNext}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border border-black/10 text-xs uppercase tracking-widest text-black/50 hover:border-black hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {formOpen && (
          <CollectionFormModal
            isOpen={formOpen}
            editingCollection={editingCollection}
            onConfirm={handleFormConfirm}
            onClose={() => setFormOpen(false)}
            isLoading={isFormSubmitting}
          />
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deletingCollection && (
          <DeleteConfirmModal
            collection={deletingCollection}
            onConfirm={handleDelete}
            onClose={() => setDeletingCollection(null)}
            isLoading={deleteCollection.isPending}
          />
        )}
      </AnimatePresence>

      {/* Detail Drawer */}
      <CollectionDetailDrawer
        collection={viewingCollection}
        onClose={() => setViewingCollection(null)}
        onEdit={(col) => {
          setViewingCollection(null);
          openEdit(col);
        }}
      />
    </DashboardLayout>
  );
};

interface CardProps {
  collection: Collection;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  isTogglingFeatured: boolean;
}

const CollectionCard = ({
  collection,
  onView,
  onEdit,
  onDelete,
  onToggleFeatured,
  isTogglingFeatured,
}: CardProps) => {
  const hasCover = !!collection.coverImage;

  return (
    <div className="group border border-black/8 bg-white hover:border-black/20 transition-colors">
      {/* Cover */}
      <div
        className="relative h-44 bg-black/3 overflow-hidden cursor-pointer"
        onClick={onView}
      >
        {hasCover ? (
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-[9px] uppercase tracking-widest text-black/20">
              No image
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {collection.featured && (
            <span className="px-2 py-0.5 bg-amber-400 text-[8px] uppercase tracking-widest font-medium text-black">
              Featured
            </span>
          )}
          {!collection.isPublished && (
            <span className="px-2 py-0.5 bg-black/70 text-[8px] uppercase tracking-widest text-white">
              Draft
            </span>
          )}
        </div>

        {/* Actions overlay */}
        <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            title="View"
            className="w-7 h-7 bg-white/90 hover:bg-white flex items-center justify-center transition shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-black/60" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFeatured();
            }}
            disabled={isTogglingFeatured}
            title={collection.featured ? "Unfeature" : "Feature"}
            className="w-7 h-7 bg-white/90 hover:bg-white flex items-center justify-center transition shadow-sm disabled:opacity-50"
          >
            {collection.featured ? (
              <StarOff className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Star className="w-3.5 h-3.5 text-black/50" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Edit"
            className="w-7 h-7 bg-white/90 hover:bg-white flex items-center justify-center transition shadow-sm"
          >
            <Pencil className="w-3.5 h-3.5 text-black/60" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete"
            className="w-7 h-7 bg-white/90 hover:bg-white flex items-center justify-center transition shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-3.5">
        <h3 className="text-sm font-light text-black/80 truncate">{collection.name}</h3>
        <p className="text-[9px] uppercase tracking-widest text-black/35 mt-0.5">
          {collection.season} · {collection.year}
          {collection.season && SEASON_LABELS[collection.season]
            ? ` · ${SEASON_LABELS[collection.season]}`
            : ""}
        </p>
        {collection.tagline && (
          <p className="text-[10px] text-black/40 mt-2 line-clamp-1 italic">
            "{collection.tagline}"
          </p>
        )}
        {(collection.piece || (collection.pieces && collection.pieces.length > 0)) && (
          <p className="text-[9px] uppercase tracking-widest text-black/25 mt-2">
            Includes a piece
          </p>
        )}
      </div>
    </div>
  );
};

export default Collections;
