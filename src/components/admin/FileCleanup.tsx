"use client";

import { useState } from "react";
import { Trash2, RefreshCw, AlertTriangle, CheckCircle, HardDrive, Image, Video, FileText } from "lucide-react";

interface FileInfo {
  path: string;
  url: string;
  name: string;
  size: number;
  folder: string;
}

interface CleanupStats {
  totalFiles: number;
  unusedCount: number;
  usedCount: number;
  unusedSize: number;
  usedSize: number;
  unusedSizeMB: string;
  usedSizeMB: string;
}

export default function FileCleanup() {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [unusedFiles, setUnusedFiles] = useState<FileInfo[]>([]);
  const [stats, setStats] = useState<CleanupStats | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const analyzeFiles = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/cleanup');
      if (!response.ok) throw new Error('Erreur analyse');
      
      const data = await response.json();
      setUnusedFiles(data.unusedFiles);
      setStats(data.stats);
      setSelectedFiles(new Set(data.unusedFiles.map((f: FileInfo) => f.url)));
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'analyse des fichiers' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSelected = async () => {
    if (selectedFiles.size === 0) return;
    
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer ${selectedFiles.size} fichier(s) ?\n\nCette action est irréversible !`
    );
    
    if (!confirmed) return;

    setDeleting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/cleanup', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: Array.from(selectedFiles) })
      });

      if (!response.ok) throw new Error('Erreur suppression');

      const data = await response.json();
      
      setMessage({ 
        type: 'success', 
        text: `${data.deletedCount} fichier(s) supprimé(s) avec succès !` 
      });
      
      // Relancer l'analyse
      await analyzeFiles();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const toggleFile = (url: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(url)) {
      newSelected.delete(url);
    } else {
      newSelected.add(url);
    }
    setSelectedFiles(newSelected);
  };

  const selectAll = () => {
    setSelectedFiles(new Set(unusedFiles.map(f => f.url)));
  };

  const selectNone = () => {
    setSelectedFiles(new Set());
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(2) + ' Mo';
  };

  const getFileIcon = (name: string) => {
    const ext = name.toLowerCase();
    if (ext.match(/\.(jpg|jpeg|png|webp|gif|heic)$/)) return <Image size={16} className="text-blue-500" />;
    if (ext.match(/\.(mp4|webm|mov)$/)) return <Video size={16} className="text-purple-500" />;
    if (ext.match(/\.pdf$/)) return <FileText size={16} className="text-red-500" />;
    return <FileText size={16} className="text-gray-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HardDrive className="text-abp-gold" size={24} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Nettoyage des fichiers</h2>
            <p className="text-sm text-gray-500">Supprimez les images et vidéos non utilisées</p>
          </div>
        </div>
        
        <button
          onClick={analyzeFiles}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-abp-primary text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Analyse...' : 'Analyser'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          {message.text}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-gray-800">{stats.totalFiles}</p>
            <p className="text-sm text-gray-500">Fichiers total</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-green-600">{stats.usedCount}</p>
            <p className="text-sm text-gray-500">Utilisés ({stats.usedSizeMB} Mo)</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-orange-600">{stats.unusedCount}</p>
            <p className="text-sm text-gray-500">Non utilisés</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-red-600">{stats.unusedSizeMB} Mo</p>
            <p className="text-sm text-gray-500">À libérer</p>
          </div>
        </div>
      )}

      {unusedFiles.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {selectedFiles.size} fichier(s) sélectionné(s)
              </span>
              <button onClick={selectAll} className="text-sm text-blue-600 hover:underline">
                Tout sélectionner
              </button>
              <button onClick={selectNone} className="text-sm text-blue-600 hover:underline">
                Désélectionner tout
              </button>
            </div>
            
            <button
              onClick={deleteSelected}
              disabled={deleting || selectedFiles.size === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              <Trash2 size={18} />
              {deleting ? 'Suppression...' : `Supprimer (${selectedFiles.size})`}
            </button>
          </div>

          <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                    <input
                      type="checkbox"
                      checked={selectedFiles.size === unusedFiles.length}
                      onChange={() => selectedFiles.size === unusedFiles.length ? selectNone() : selectAll()}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fichier</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Dossier</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Taille</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {unusedFiles.map((file) => (
                  <tr 
                    key={file.url} 
                    className={`hover:bg-gray-50 ${selectedFiles.has(file.url) ? 'bg-red-50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedFiles.has(file.url)}
                        onChange={() => toggleFile(file.url)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.name)}
                        <span className="text-sm text-gray-700 truncate max-w-xs" title={file.name}>
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{file.folder}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-right">{formatSize(file.size)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {stats && unusedFiles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle className="mx-auto mb-2 text-green-500" size={48} />
          <p className="font-medium">Tout est propre !</p>
          <p className="text-sm">Aucun fichier non utilisé détecté.</p>
        </div>
      )}

      {!stats && (
        <div className="text-center py-8 text-gray-400">
          <HardDrive className="mx-auto mb-2" size={48} />
          <p>Cliquez sur "Analyser" pour scanner les fichiers non utilisés</p>
        </div>
      )}
    </div>
  );
}
