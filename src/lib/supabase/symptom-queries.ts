/**
 * Symptom Tracking Query Functions
 * Handles symptom logs and scanned items
 */

import { supabase } from './client';

export interface SymptomLog {
  id: string;
  tenantid: string;
  projectid: string;
  symptom_ids: string[];
  mood?: string;
  energy_level?: number;
  notes?: string;
  severity?: number;
  logged_at: string;
  created_at: string;
  updated_at: string;
}

export interface ScannedItem {
  id: string;
  tenantid: string;
  projectid: string;
  item_name: string;
  item_type?: string;
  barcode?: string;
  brand?: string;
  ingredients?: string[];
  allergens?: string[];
  notes?: string;
  image_url?: string;
  symptom_log_id?: string;
  scanned_at: string;
  created_at: string;
  updated_at: string;
}

// Symptom Log Queries

export async function getSymptomLogs(limit = 50) {
  const { data, error } = await supabase
    .from('symptom_logs')
    .select('*')
    .order('logged_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as SymptomLog[];
}

export async function getSymptomLogById(id: string) {
  const { data, error } = await supabase
    .from('symptom_logs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as SymptomLog;
}

export async function createSymptomLog(log: Partial<SymptomLog>) {
  const { data, error } = await supabase
    .from('symptom_logs')
    .insert({
      tenantid: 'F7oiAnbgkFO4Kaxftd6EI6aD3WX2',
      projectid: '522f48ed-1e2c-4fab-8b1f-03bcb7892df9',
      ...log
    })
    .select()
    .single();

  if (error) throw error;
  return data as SymptomLog;
}

export async function updateSymptomLog(id: string, updates: Partial<SymptomLog>) {
  const { data, error } = await supabase
    .from('symptom_logs')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as SymptomLog;
}

export async function deleteSymptomLog(id: string) {
  const { error } = await supabase
    .from('symptom_logs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Scanned Item Queries

export async function getScannedItems(limit = 50) {
  const { data, error } = await supabase
    .from('scanned_items')
    .select('*')
    .order('scanned_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as ScannedItem[];
}

export async function getScannedItemById(id: string) {
  const { data, error } = await supabase
    .from('scanned_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as ScannedItem;
}

export async function createScannedItem(item: Partial<ScannedItem>) {
  const { data, error } = await supabase
    .from('scanned_items')
    .insert({
      tenantid: 'F7oiAnbgkFO4Kaxftd6EI6aD3WX2',
      projectid: '522f48ed-1e2c-4fab-8b1f-03bcb7892df9',
      ...item
    })
    .select()
    .single();

  if (error) throw error;
  return data as ScannedItem;
}

export async function updateScannedItem(id: string, updates: Partial<ScannedItem>) {
  const { data, error } = await supabase
    .from('scanned_items')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as ScannedItem;
}

export async function deleteScannedItem(id: string) {
  const { error } = await supabase
    .from('scanned_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getScannedItemsBySymptomLog(symptomLogId: string) {
  const { data, error } = await supabase
    .from('scanned_items')
    .select('*')
    .eq('symptom_log_id', symptomLogId)
    .order('scanned_at', { ascending: false });

  if (error) throw error;
  return data as ScannedItem[];
}
