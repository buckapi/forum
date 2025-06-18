import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { CommonModule } from '@angular/common';
import PocketBase from 'pocketbase';
import { GlobalService } from '../../services/global.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

// ✅ Validador personalizado para contenido enriquecido
export function quillRequired(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  // Permite <p><br></p> como válido
  if (value === '<p><br></p>' || value.trim() === '') return { required: true };
  const stripped = value.replace(/<(.|\n)*?>/g, '').trim();
  return stripped.length === 0 ? { required: true } : null;
}
@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
  topicForm: FormGroup;
  pb: PocketBase;
  corrientes: any[] = [];
  userId: string | null = null;

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  constructor(
    public global: GlobalService,
    private fb: FormBuilder,
    public auth: AuthService
  ) {
    this.pb = this.global.pb;
    this.topicForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', quillRequired], // validador personalizado
      corriente: [null, Validators.required],
      tags: ['', Validators.required]
    });
    this.userId = this.auth.getCurrentUser()?.userId || null;
  }

  ngOnInit(): void {
    this.global.corrientes$.subscribe(c => this.corrientes = c);
    this.auth.user$.subscribe(user => {
      this.userId = user?.userId || null;
    });
  }

  async createTopic() {
    console.log(this.topicForm.value, this.topicForm.valid, this.topicForm.errors);
    if (this.topicForm.invalid || !this.userId) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Completa todos los campos antes de enviar.',
      });
      return;
    }

    const { title, content, corriente, tags } = this.topicForm.value;

    const data = {
      title,
      content,
      corriente: {
        id: corriente.id,
        name: corriente.name
      },
      author: this.userId,
      tags: tags.split(',').map((tag: string) => tag.trim())
    };

    try {
      const record = await this.pb.collection('forumTopic').create(data);
      Swal.fire({
        icon: 'success',
        title: 'Tema creado',
        text: 'Tu tema se ha publicado correctamente.',
        timer: 3000,
        showConfirmButton: false
      });
      this.topicForm.reset();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear el tema',
        text: typeof error === 'string' ? error : error.message || JSON.stringify(error),
      });
    }
  }
}
