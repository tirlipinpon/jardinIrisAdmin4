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

  async getOneOrManyPostForm(idPost?: number, orderBySelected?: string) {
    try {
      let query = this.supabase
        .from('post')
        .select('*')

      if (idPost && idPost>0) {
        query = query.eq('id', idPost);
      }

      if (orderBySelected) {
        if(orderBySelected==='valid') {
          query = query.order(orderBySelected, { ascending: true });
        } else if(orderBySelected==='original') {
          query = query
            .eq('valid', true)
            .eq('deleted', false)
            .order('created_at', { ascending: false });
        } else {
          query = query.order(orderBySelected, { ascending: false });
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // // Tri des données par le champ "deleted" après récupération
      // const sortedData = data.sort((a: any, b: any) => {
      //   return a.deleted - b.deleted;
      // });
      //
      // console.log(sortedData);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getAllComments() {
    try {
      let query = this.supabase
        .from('comments')
        .select('*')

      const { data, error } = await query;

      if (error) {
        throw error;
      }
      return data;
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

  async deleteCommentById(id: number) {
    try {
      const { data, error } = await this.supabase
        .from('comments')
        .update({ valide: 'false' })
        .eq('id', id)

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async valideCommentById(id: number) {
    try {
      const { data, error } = await this.supabase
        .from('comments')
        .update({ valide: 'true' })
        .eq('id', id)

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }



}
