import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Form, FormControl, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import MessagesUtil from '../../../../util/messages.utill';
import {ERROR_MESSAGE, MORENA, PSI, PT, SAVE_MESSAGE, VERDE} from '../../../../util/Config.utils';
import {CandidateService} from '../../../../services/candidate.service';
import {Router} from '@angular/router';
import {messageErrorValidation, ValidatorEquals} from '../../../../util/ValidatorsHelper';

@Component({
  selector: 'app-candidate-ine',
  templateUrl: './candidate-ine.component.html',
  styleUrls: ['./candidate-ine.component.scss']
})
export class CandidateIneComponent implements OnInit {

  @Output()
  onFormCandidateChange = new EventEmitter<any>();

  form: FormGroup;
  formAlternate: FormGroup;
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
    this.form = new FormGroup({
          number_line: new FormControl('', [Validators.required]),
          circumscription: new FormControl('', [Validators.required]),
          locality: new FormControl('', [Validators.required]),
          demarcation: new FormControl('', [ ]),
          municipalities_council: new FormControl('', [Validators.required]),
          campaign_slogan: new FormControl('', [Validators.required]),
          list_number: new FormControl('', [Validators.required]),
          campaign: new FormControl('', [Validators.required]),
          curp: new FormControl('', [Validators.required]),
          curp_confirmation: new FormControl('', [Validators.required]),
          rfc: new FormControl('', [Validators.required]),
          phone_type: new FormControl('', [Validators.required]),
          lada: new FormControl('', [Validators.required]),
          phone: new FormControl(''),
          extension: new FormControl('', [Validators.required]),
          email: new FormControl('', [Validators.required]),
          email_confirmation: new FormControl('', [Validators.required]),
          total_annual_income: new FormControl('', [Validators.required]),
          salary_annual_income: new FormControl('', [Validators.required]),
          financial_performances: new FormControl('', [Validators.required]),
          annual_profit_professional_activity: new FormControl('', [Validators.required]),
          annual_real_estate_lease_earnings: new FormControl('', [Validators.required]),
          professional_services_fees: new FormControl('', [Validators.required]),
          other_income: new FormControl('', [Validators.required]),
          total_annual_expenses: new FormControl('', [Validators.required]),
          personal_expenses: new FormControl('', [Validators.required]),
          real_estate_payments: new FormControl('', [Validators.required]),
          debt_payments: new FormControl('', [Validators.required]),
          loss_personal_activity: new FormControl('', [Validators.required]),
          other_expenses: new FormControl(1, [Validators.required]),
          property: new FormControl('', [Validators.required]),
          vehicles: new FormControl('', [Validators.required]),
          other_movable_property: new FormControl('', [Validators.required]),
          bank_accounts: new FormControl('', [Validators.required]),
          other_assets: new FormControl('', [Validators.required]),
          payment_debt_amount: new FormControl('', [Validators.required]),
          other_passives: new FormControl('', [Validators.required]),
        }
    );

      const user = JSON.parse(localStorage.getItem('user'));
      switch (user.politic_party_id) {
          case MORENA: {
              this.party_color = 'morena'
              break;
          }
          case PT: {
              this.party_color = 'pt'
              break;
          }
          case VERDE: {
              this.party_color = 'verde'
              break;
          }
          case PSI: {
              this.party_color = 'psi'
              break;
          }
          default: {
              this.party_color = 'morena'
          }
      }
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

  getMessageError(attrName: string) {
    return messageErrorValidation(this.form, attrName);
  };


}
