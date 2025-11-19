
import React, { useState } from 'react';
import type { Product } from './types';
import { PRODUCTS } from './constants';
import { PencilIcon, TrashIcon } from './components/Icons';

const initialFormState: Omit<Product, 'id' | 'tags'> & { tags: string } = {
  name: '',
  description: '',
  imageUrl: '',
  price: '',
  category: '',
  tags: '',
};

export const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const handleOpenModal = (product: Product | null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...product, tags: product.tags.join(', ') });
    } else {
      setEditingProduct(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(initialFormState);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(p =>
        p.id === editingProduct.id ? { ...p, ...productData } : p
      );
      setProducts(updatedProducts);
    } else {
      // Add new product
      const newProduct: Product = {
        ...productData,
        id: Date.now(), // simple id generation
      };
      setProducts([...products, newProduct]);
    }
    handleCloseModal();
  };

  const handleDelete = (productId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
            <h1 className="text-3xl font-bold text-brand-green-dark">Administração de Produtos</h1>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => handleOpenModal(null)}
            className="bg-brand-green-dark text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Adicionar Novo Produto
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Imagem</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Categoria</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Preço</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4"><img src={product.imageUrl} alt={product.name} className="h-12 w-12 object-cover rounded-md" /></td>
                  <td className="p-4 text-gray-800 font-medium">{product.name}</td>
                  <td className="p-4 text-gray-600">{product.category}</td>
                  <td className="p-4 text-gray-800 font-semibold">{product.price}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-4">
                      <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:text-blue-800 transition-colors" aria-label={`Editar ${product.name}`}>
                        <PencilIcon />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 transition-colors" aria-label={`Excluir ${product.name}`}>
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="p-8">
                <h2 className="text-2xl font-bold font-serif text-brand-green-dark mb-6">{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green-dark focus:border-brand-green-dark" />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                    <input type="text" name="price" id="price" value={formData.price} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green-dark focus:border-brand-green-dark" />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green-dark focus:border-brand-green-dark"></textarea>
                  </div>
                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                    <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green-dark focus:border-brand-green-dark" />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green-dark focus:border-brand-green-dark" />
                  </div>
                   <div className="md:col-span-2">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (separadas por vírgula)</label>
                    <input type="text" name="tags" id="tags" value={formData.tags} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green-dark focus:border-brand-green-dark" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-8 py-4 flex justify-end space-x-4 rounded-b-lg">
                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancelar</button>
                <button type="submit" className="bg-brand-green-dark text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors">Salvar Produto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
