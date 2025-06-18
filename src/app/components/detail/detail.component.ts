import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  reactions = {
    like: 0,
    dislike: 0,
    favorite: 0
  };

  comments: any[] = [];
  commentForm: FormGroup;
  userId: string | null = null;
  replyToCommentId: string | null = null;
  commentReactions: { [id: string]: { like: number; dislike: number } } = {};
  replyReactions: { [id: string]: { like: number; dislike: number } } = {};
  
  constructor(
    public global: GlobalService,
    public sanitizer: DomSanitizer,
    public auth: AuthService,
    public fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
    this.userId = this.auth.getCurrentUser()?.id || null;
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      console.log('🧑‍💻 Usuario cargado:', user);
      this.userId = user?.id || null;
    });
    this.loadReactions();
    this.loadComments();
  }
  

  get sanitizedContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.global.topic.content || '');
  }

  /* async react(type: 'like' | 'dislike' | 'favorite', targetId: string) {
    console.log('Intentando reaccionar:', { type, targetId, userId: this.userId });
    if (!this.userId) return;
  
    try {
      // Verifica si ya reaccionó
      const existing = await this.global.pb.collection('forumReactions').getFirstListItem(
        `author="${this.userId}" && targetId="${targetId}" && type="${type}" && targetType="topic"`
      );
      if (existing) {
        console.warn('Ya reaccionó con este tipo.');
        return;
      }
    } catch (e: any) {
      // Si no hay reacción previa, se lanza error (Expected)
    }
  
    const data = {
      type,
      targetType: 'topic',
      targetId,
      author: this.userId
    };
  
    try {
      await this.global.pb.collection('forumReactions').create(data);
      this.loadReactions(); // refresca los contadores
    } catch (error) {
      console.error('Error al reaccionar:', error, data);
    }
  } */

    async react(type: 'like' | 'dislike' | 'favorite', targetId: string, targetType: 'topic' | 'comment' = 'topic') {
      if (!this.userId) return;
    
      try {
        const existing = await this.global.pb.collection('forumReactions').getFirstListItem(
          `author="${this.userId}" && targetId="${targetId}" && type="${type}" && targetType="${targetType}"`
        );
        if (existing) return;
      } catch {}
    
      const data = { type, targetType, targetId, author: this.userId };
    
      try {
        await this.global.pb.collection('forumReactions').create(data);
        this.loadReactions();
        this.loadComments(); // para actualizar reacciones en comentarios
      } catch (error) {
        console.error('Error al reaccionar:', error);
      }
    }
    
  async loadReactions() {
    try {
      const reactions = await this.global.pb.collection('forumReactions').getFullList({
        filter: `targetId="${this.global.topic.id}" && targetType="topic"`
      });

      this.reactions.like = reactions.filter(r => r['type'] === 'like').length;
      this.reactions.dislike = reactions.filter(r => r['type'] === 'dislike').length;
      this.reactions.favorite = reactions.filter(r => r['type'] === 'favorite').length;
    } catch (error) {
      console.error('Error cargando reacciones:', error);
    }
  }
  setReplyTarget(commentId: string) {
    this.replyToCommentId = commentId;
  }

 /*  async loadComments() {
    
    try {
      this.comments = await this.global.pb.collection('forumPosts').getFullList({
        filter: `topic="${this.global.topic.id}"`,
        sort: '-created',
        expand: 'author'
      });
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    }
  } */
    async loadComments() {
      try {
        const allComments = await this.global.pb.collection('forumPosts').getFullList({
          filter: `topic="${this.global.topic.id}"`,
          sort: 'created',
          expand: 'author,parent'
        });
    
        // Cargar reacciones por cada comentario
        for (const comment of allComments) {
          const reactions = await this.global.pb.collection('forumReactions').getFullList({
            filter: `targetId="${comment.id}" && targetType="comment"`
          });
    
          comment['reactions'] = {
            like: reactions.filter(r => r['type'] === 'like').length,
            dislike: reactions.filter(r => r['type'] === 'dislike').length
          };
        }
    
        // Agrupar por comentarios principales e hijos
        const map: { [id: string]: any[] } = {};
        allComments.forEach(c => {
          if (c['parent']) {
            if (!map[c['parent']]) map[c['parent']] = [];
            map[c['parent']].push(c);
          }
        });
    
        this.comments = allComments
          .filter(c => !c['parent'])
          .map(c => ({ ...c, replies: map[c['id']] || [] }));
    
      } catch (error) {
        console.error('Error al cargar comentarios:', error);
      }
    }
    
    
  /* async submitComment() {
    console.log('Enviando comentario con autor ID:', this.userId);

    if (!this.userId || this.commentForm.invalid) {
      console.warn('Formulario inválido o usuario no autenticado');
      return;
    }
  
    const content = this.commentForm.value.content;
  
    try {
      const result = await this.global.pb.collection('forumPosts').create({
        content,
        author: this.userId,
        topic: this.global.topic.id
      });
  
      console.log('Comentario creado:', result);
      this.commentForm.reset();
      this.loadComments();
    } catch (error) {
      console.error('Error al comentar:', error);
    }
  } */
 
    async submitComment() {
      if (!this.userId || this.commentForm.invalid) return;
    
      const content = this.commentForm.value.content;
      const data: any = {
        content,
        author: this.userId,
        topic: this.global.topic.id
      };
    
      if (this.replyToCommentId) {
        data.parent = this.replyToCommentId;
      }
    
      try {
        await this.global.pb.collection('forumPosts').create(data);
        this.commentForm.reset();
        this.replyToCommentId = null;
        this.loadComments();
      } catch (error) {
        console.error('Error al comentar:', error);
      }
    }
    
}
