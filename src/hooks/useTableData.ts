import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type TableName = "services" | "skills" | "brands" | "projects" | "testimonials";

export function useTableData(table: TableName) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: rows, error: fetchError } = await supabase.from(table).select("*").order("sort_order");
      if (fetchError) throw fetchError;
      setData(rows ?? []);
    } catch (err: any) {
      setError(err.message ?? "Failed to fetch data");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const add = async (item: any) => {
    try {
      const { error } = await supabase.from(table).insert([item]);
      if (error) { toast.error("Failed to add: " + error.message); return { error }; }
      await fetchData();
      return { error: null };
    } catch (err: any) {
      toast.error("Failed to add item");
      return { error: err };
    }
  };

  const update = async (id: string, item: any) => {
    try {
      // @ts-ignore - dynamic table access
      const { error } = await supabase.from(table).update(item).eq("id", id);
      if (error) { toast.error("Failed to update: " + error.message); return { error }; }
      await fetchData();
      return { error: null };
    } catch (err: any) {
      toast.error("Failed to update item");
      return { error: err };
    }
  };

  const remove = async (id: string) => {
    try {
      // @ts-ignore - dynamic table access
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) { toast.error("Failed to delete: " + error.message); return { error }; }
      await fetchData();
      return { error: null };
    } catch (err: any) {
      toast.error("Failed to delete item");
      return { error: err };
    }
  };

  return { data, loading, error, refresh: fetchData, add, update, remove };
}
