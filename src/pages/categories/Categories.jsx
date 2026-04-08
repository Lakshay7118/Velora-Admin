import { useEffect, useState } from "react";
import axios from "axios";
import { 
  FolderPlus, 
  Trash2, 
  Tag, 
  Layers, 
  Search,
  Plus
} from "lucide-react";

export default function Categories() {

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  // 🔥 FETCH FROM DATABASE
  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ➕ ADD CATEGORY (DB)
  const addCategory = async () => {
    if (!newCategory.trim()) return;

    await axios.post("http://localhost:5000/api/categories", {
      name: newCategory
    });

    setNewCategory("");
    fetchCategories();
  };

  // 🗑 DELETE CATEGORY (DB)
 const deleteCategory = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmDelete) return;

  await axios.delete(`http://localhost:5000/api/categories/${id}`);
  fetchCategories();
};


  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <p className="text-sm text-gray-500">
          Organize your products into logical groups.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">

            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <FolderPlus className="w-5 h-5" />
              <h2 className="font-semibold text-gray-800">Create New</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Winter Wear"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                />
              </div>

              <button
                onClick={addCategory}
                className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 leading-relaxed">
                <strong>Tip:</strong> Keep names short and descriptive for better navigation.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-600">
                <Layers className="w-4 h-4" />
                <span className="text-sm font-medium">
                  All Categories ({categories.length})
                </span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter list..."
                  className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 w-40 sm:w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Category Details</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {categories.map((cat, index) => (
                    <tr key={cat._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-md group-hover:bg-indigo-100 transition-colors">
                            <Tag className="w-4 h-4 text-gray-500 group-hover:text-indigo-600" />
                          </div>
                          <span className="font-medium text-gray-700">
                            {cat.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => deleteCategory(cat._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {categories.length === 0 && (
              <div className="p-12 text-center">
                <Layers className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 italic">
                  No categories created yet.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
