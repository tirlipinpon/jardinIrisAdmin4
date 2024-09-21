import { Injectable } from '@angular/core';
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {environment} from "../../../../environment";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  async setNewPostForm(value: any) {
    try {
      const { data, error } = await this.supabase
        .from('post')
        .insert([value])
        .select();

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getOneOrManyPostForm(idPost?: number) {
    try {
      let query = this.supabase
        .from('post')
        .select('*')
        .order('created_at', { ascending: false });

      if (idPost) {
        query = query.eq('id', idPost);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Tri des données par le champ "deleted" après récupération
      const sortedData = data.sort((a: any, b: any) => {
        return a.deleted - b.deleted;
      });

      console.log(sortedData);
      return sortedData;
    } catch (error) {
      throw error;
    }
  }


  async deletePostByIdForm(idPost: number) {
    try {
      const { data, error } = await this.supabase
        .from('post')
        .update({ deleted: 'true' })
        .eq('id', idPost)

      if (error) {
        throw error;
      }
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateValidPostByIdForm(idPost: number) {
    try {
      const { data, error } = await this.supabase
        .from('post')
        .update({ valid: 'true' })
        .eq('id', idPost)

      if (error) {
        throw error;
      }
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updatePostByIdForm(dataPost: any) {
    try {
      const { data, error } = await this.supabase
        .from('post')
        .update(dataPost)
        .eq('id', dataPost.id);

      if (error) {
        throw error;
      }
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }



}
