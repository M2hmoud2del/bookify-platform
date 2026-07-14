import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-upload-area',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './upload-area.component.html',
  styleUrl: './upload-area.component.css',
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
