import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../util/messages.utill';
import {ERROR_MESSAGE, SAVE_MESSAGE} from '../../../../util/Config.utils';
import {CandidateService} from '../../../../services/candidate.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-candidate-ine',
  templateUrl: './candidate-ine.component.html',
  styleUrls: ['./candidate-ine.component.scss']
})
export class CandidateIneComponent implements OnInit {

  @Output()
  onFormCandidateChange = new EventEmitter<any>();

  form: FormGroup;
  editForm = false;

  roads = [
    {id: 1, name: 'Ampliación'},
    {id: 2, name: 'Andador'},
    {id: 3, name: 'Avenida'},
    {id: 4 , name: 'Boulevard'},
    {id: 5, name: 'Calle'},
    {id: 6, name: 'Callejon'},
    {id: 7, name: 'Calzada'},
    {id: 8, name: 'Cerrada'},
    {id: 9, name: 'Circuito'},
    {id: 10, name: 'Circulación'},
    {id: 11, name: 'Continuación'},
    {id: 12, name: 'Corredor'},
    {id: 13, name: 'Diagonal'},
    {id: 14, name: 'Eje vial'},
    {id: 15, name: 'Pasaje'},
    {id: 16, name: 'Peatonal'},
    {id: 17, name: 'Periférico'},
    {id: 18, name: 'Privada'},
    {id: 19, name: 'Prolongación'},
    {id: 20, name: 'Retorno'},
    {id: 21, name: 'Viaducto'},
  ]

  postulate = [
    {id: 1, name: 'Diputación'},
    {id: 2, name: 'Regidor'},
    {id: 3, name: 'Sindicatura'},
  ];

  type = [
    {id: 4, name: 'Propietario'},
    {id: 5, name: 'Suplente'},
  ];

  reelection = [
    {value: 1, label: 'Si'},
    {value: 0, label: 'No'}
  ]

  genders = [
    {value: 0, label: 'Hombre'},
    {value: 1, label: 'Mujer'}
  ]


  party_color: string;

  constructor(
      private _candidate: CandidateService,
      private _router: Router,
  ) { }

  ngOnInit(): void {
  }

  onFormCandidateChangeEvent(_event) {
    console.log(_event);
    this.form = _event;
    // console.error(_event, this.form['controls']);
  }

  submit() {
    Swal.showLoading();
    this._candidate.add(this.form.value).subscribe(
        response => {
          console.log(response);
          this.successSave();
        },
        error => {
          console.log(error);
          MessagesUtil.errorMessage(ERROR_MESSAGE);
        }
    );
  }

  successSave() {
    MessagesUtil.successMessage('Éxito', SAVE_MESSAGE);
    this.form.reset();
  }

  cancel() {
    this.form.reset();
    if (this.editForm) {
      this._router.navigate(['/candidateList']);
    }
  }


}
