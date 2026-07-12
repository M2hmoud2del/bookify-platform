import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-upload-area',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div
      class="upload-zone"
      [class.is-dragging]="isDragging()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
    >
      <input
        #fileInput
        type="file"
        class="file-input"
        [accept]="accept()"
        [multiple]="multiple()"
        (change)="onFileSelect($event)"
      />

      <div class="upload-icon">
        <span class="material-icons-outlined">{{ icon() }}</span>
      </div>
      <h3 class="upload-title">{{ title() }}</h3>
      <p class="upload-desc">{{ description() }}</p>
      <p class="upload-hint">or drag and drop files here</p>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .upload-zone {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-10) var(--space-6);
      border: 2px dashed var(--border);
      border-radius: var(--radius-2xl);
      background: var(--gray-50);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: center;
    }

    :host-context(.dark) .upload-zone {
      background: var(--gray-900);
      border-color: var(--gray-700);
    }

    .upload-zone:hover {
      border-color: var(--primary-400);
      background: var(--primary-50);
    }

    :host-context(.dark) .upload-zone:hover {
      border-color: var(--primary-500);
      background: rgba(79, 70, 229, 0.05);
    }

    .upload-zone.is-dragging {
      border-color: var(--primary-500);
      background: var(--primary-100);
      transform: scale(1.01);
    }

    :host-context(.dark) .upload-zone.is-dragging {
      background: rgba(79, 70, 229, 0.15);
    }

    .file-input {
      position: absolute;
      width: 0;
      height: 0;
      opacity: 0;
      pointer-events: none;
    }

    .upload-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: var(--primary-100);
      border-radius: var(--radius-full);
      margin-bottom: var(--space-2);
    }

    :host-context(.dark) .upload-icon {
      background: rgba(79, 70, 229, 0.15);
    }

    .upload-icon .material-icons-outlined {
      font-size: 2rem;
      color: var(--primary-500);
    }

    .upload-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .upload-desc {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    .upload-hint {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      margin: var(--space-1) 0 0;
    }
  `],
})
export class UploadAreaComponent {
  title = input('Upload Images');
  description = input('Click to browse or drag and drop');
  accept = input('image/*');
  multiple = input(true);
  icon = input('cloud_upload');

  filesSelected = output<File[]>();

  isDragging = signal(false);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    const files = Array.from(event.dataTransfer?.files ?? []);
    if (files.length > 0) this.filesSelected.emit(files);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (files.length > 0) this.filesSelected.emit(files);
    input.value = '';
  }
}
