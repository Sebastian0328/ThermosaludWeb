import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  isModalOpen: boolean = false;
  isSuccess: boolean = false; // Controla si se muestra el mensaje de éxito
  isError: boolean = false; // Controla si se muestra el mensaje de error

  formData = {
    nombre_usuario: '',
    apellido: '',
    email: '',
    telefono: '',
    fecha: '',
    hora: ''
  };

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    selectable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    select: this.handleDateSelect.bind(this),
    events: []
  };

  constructor(private http: HttpClient) {}

  handleDateSelect(selectInfo: DateSelectArg) {
    this.isModalOpen = true;
    this.isSuccess = false; // Reinicia el estado de éxito
    this.isError = false; // Reinicia el estado de error
    this.formData.fecha = selectInfo.startStr;
    this.formData.hora = selectInfo.start.toLocaleTimeString();
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      nombre_usuario: '',
      apellido: '',
      email: '',
      telefono: '',
      fecha: '',
      hora: ''
    };
  }

  submitForm() {
    if (!this.isFormValid()) {
      alert('Por favor, completa todos los campos antes de enviar.');
      return;
    }
    const data = {
      nombre: this.formData.nombre_usuario,
      apellido: this.formData.apellido,
      correo: this.formData.email,
      telefono: this.formData.telefono,
      fecha: this.formData.fecha,
      hora: this.formData.hora
    };

    this.http.post('http://localhost:3000/api/citas', data).subscribe({
      next: () => {
        this.isSuccess = true; // Muestra el mensaje de éxito
        this.isError = false; // Asegúrate de ocultar el mensaje de error
        setTimeout(() => {
          this.closeModal();
        }, 2000); // Cierra el modal después de 2 segundos
      },
      error: (error) => {
        console.error('Error al reservar la cita:', error);
        this.isError = true; // Muestra el mensaje de error
        this.isSuccess = false; // Asegúrate de ocultar el mensaje de éxito
      }
    });
  }
  isFormValid(): boolean {
    // Verifica si todos los campos requeridos están completos
    return !!(
      this.formData.nombre_usuario &&
      this.formData.apellido &&
      this.formData.email &&
      this.formData.telefono &&
      this.formData.fecha &&
      this.formData.hora
    );
  }
}
