"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Check } from "lucide-react";
import { exportTransactionsToCSV } from "@/app/actions/export-csv";

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const result = await exportTransactionsToCSV();

      if (result.success && result.data && result.filename) {
        // Create blob and download
        const blob = new Blob([result.data], {
          type: "text/csv;charset=utf-8",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        alert(result.error || "Błąd eksportu");
      }
    } catch (error) {
      alert("Wystąpił błąd podczas eksportu");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className={`gap-2 transition-colors ${
        showSuccess
          ? "border-green-500 text-green-600 bg-green-50"
          : "hover:border-blue-500 hover:text-blue-600"
      }`}
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : showSuccess ? (
        <Check className="h-4 w-4" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {showSuccess ? "Pobrano!" : "Eksport CSV"}
    </Button>
  );
}
