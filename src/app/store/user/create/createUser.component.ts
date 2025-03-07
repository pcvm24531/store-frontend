import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../core/service/user.service';
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ButtonComponent, TitleComponent, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './createUser.component.html',
  styleUrl: './createUser.component.css'
})
export class CreateUserComponent {


  //Ceamos las reglas de validacion
  createUserForm: FormGroup = new FormGroup({
    name: new FormControl(
      '',
      [Validators.required],
    ),
    lastname: new FormControl(
      '',
      [Validators.required]
    ),
    ci: new FormControl(
      '',
      [Validators.required]
    ),
    username: new FormControl(
      '',
      [Validators.required]
    ),
    password: new FormControl(
      '',
      [Validators.required]
    ),
    phone: new FormControl(
      '',
      [Validators.required, Validators.pattern('^[0-9]{8}')]
    ),
    address: new FormControl(
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(200)]
    ),
    birthdate: new FormControl(
      '',
      [Validators.required]
    ),
    photo: new FormControl(
      '',
      []
    ),
    user_type: new FormControl(
      '',
      [Validators.required]
    ),
  });
  //Finaliza las reglas de validación

  isLoading: boolean = false;
  errorMessage: string | null = null;

  //Output
  @Output() userAdded = new EventEmitter<string>();

  constructor( private userService: UserService, private fb: FormBuilder, private dialogRef: MatDialogRef<CreateUserComponent>){}

  valuesUserForm: any;
  selectedFile: File | null = null;

  //   FUnción para cargar imagen
  inFileSelected(event: any): void {
    this.selectedFile = event?.target.files[0] as File;
  }

  saveUser(): void {console.log('function saveUser');
    this.valuesUserForm = this.createUserForm.value;
    //Verificamos si los campos fueron validados correctamente
    if( this.createUserForm.valid ){
      //Activamos el indicador de carga
      this.isLoading = true;
      //Capturamos los datos del formulario
      const formData = this.createUserForm.value;

      //Llamada al servicio para enviar los datos del formulario via POST
      this.userService.saveUser(formData).subscribe(
        {
          next: (response)=>{
            this.close();
            this.createUserForm.reset();
            this.isLoading = false;
            this.userAdded.emit('userAdded');//Notificamos al componente padre
          },
          error: (err)=>{
            console.log('Error al guardar el usuario ', err);
            this.isLoading = false;
          }
        }
      );
    }else{
      console.log('Formulario inválido, por favor revisa los campos');
      this.isLoading = false;
    }
  }

  //Cerramos el modal
  close(): void{
    this.dialogRef.close();
  }

}
