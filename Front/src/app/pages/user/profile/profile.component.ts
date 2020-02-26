import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { User } from 'src/app/interfaces/User';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store/reducers';
import * as fromProfile from './store/reducers';
import { genderActions } from './store/actions';
import { userActions, authActions } from 'src/app/store/actions';
import { HttpClient } from '@angular/common/http';
import { LanguageConfig } from 'src/app/language-config';
import { isMajor } from 'src/app/validators/isMajor-validator';
import { AlertOptions } from 'src/app/interfaces/alert-options';
import { UploaderOptions } from 'src/app/interfaces/uploader-options';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/interfaces/language';
import { Gender } from 'src/app/interfaces/gender';
import { DecodedJwt } from 'src/app/interfaces/decoded-jwt';
import { Process } from 'src/app/interfaces/process';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public uploader: FileUploader = new FileUploader({ url: 'localhost:3000/upload/' });
  public uploaderOptions: UploaderOptions;
  public idFile: any;
  private _file: File;
  public form: FormGroup;
  public limitDates: any;
  public alertOptionsDomicile: AlertOptions = <AlertOptions>{};
  public languageConfig: LanguageConfig = new LanguageConfig();
  public getAppLanguage$: Observable<Language>;
  public genders: Gender[] = [];
  private _updateAlert: AlertOptions = <AlertOptions>{};
  public _jwt: string;
  public _decodedJwt: DecodedJwt = <DecodedJwt>{};
  public user: User = <User>{};
  private _pendingProcess: Process;
  private _appLanguage: Language;
  private _error: Error;
  private _subscriptions: Subscription[] = [];

  @Input() options: UploaderOptions;
  @Output() fileUploaded = new EventEmitter();
  @ViewChild('placesRef', { read: false, static: false }) placesRef: GooglePlaceDirective;

  constructor(private _ngbDateParserFormatter: NgbDateParserFormatter,
    private _http: HttpClient,
    private _store: Store<fromProfile.AppState>) {
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.form = new FormGroup({
      Name: new FormControl(null, [
        Validators.required
      ]),
      Birthdate: new FormControl(null, [
        Validators.required,
        isMajor()
      ]),
      NumExt: new FormControl(null, [
        Validators.required
      ]),
      NumInt: new FormControl(null, [
        Validators.pattern(/^\d+$/),
        Validators.maxLength(6)
      ]),
      Suburb: new FormControl(null, [
        Validators.required
      ]),
      Street: new FormControl(this.user.Suburb, [
        Validators.required
      ]),
      Town: new FormControl(null, [
        Validators.required
      ]),
      State: new FormControl(null, [
        Validators.required
      ]),
      Country: new FormControl(null, [
        Validators.required
      ]),
      PostalCode: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.maxLength(5),
        Validators.minLength(5)
      ]),
      Gender: new FormControl(1, [
        Validators.required
      ]),
      Phone: new FormControl(null),
    });
  }

  ngOnInit() {
    this._subscriptions.push(
      this.getAppLanguage$.subscribe(appLanguage => { this._appLanguage = appLanguage; }),
      this._store.select(fromStore.getAuthAlert, { actionType: userActions.UPDATE_USER }).subscribe(updateAlert => {
        this._updateAlert = updateAlert;
      }),
      this._store.select(fromProfile.getGenders).subscribe(genders => { this.genders = genders; }),
      this._store.select(fromStore.getUserInfo).subscribe(user => {
        if (user.Oid) {
          this.user = { ...user };
          const userForm = { ...this.user };
          this.user.Phone = this.user.Phone ? JSON.parse(this.user.Phone) : this.user.Phone;
          const birthdate = this.user.Birthdate ? new Date(this.user.Birthdate) : this.user.Birthdate;
          // tslint:disable-next-line: max-line-length
          const ngBirthdate = birthdate ? { year: birthdate.getFullYear(), month: birthdate.getUTCMonth() + 1, day: birthdate.getUTCDate() } : birthdate;
          userForm.Birthdate = ngBirthdate;
          userForm.Phone = userForm.Phone ? JSON.parse(userForm.Phone).number : null;
          userForm.Gender = userForm.Gender ? userForm.Gender : 1;
          this.form.patchValue(userForm);
        }
      }),
      // tslint:disable-next-line: max-line-length
      this._store.select(fromStore.getPendingProcesses).subscribe(pendingProcesses => {
        this._pendingProcess = pendingProcesses.CompleteRegister ? pendingProcesses.CompleteRegister[0] : <Process>{};
        if (this._pendingProcess.Finished) {
          // this._router.navigate(['/']);
        }
      }),
      this._store.select(fromStore.getJwt).subscribe(jwt => { this._jwt = jwt; }),
      this._store.select(fromStore.getDecodeJwt).subscribe(decodedJwt => { this._decodedJwt = decodedJwt; }),
    );
    if (this.genders.length === 0) {
      this.getGenders();
    }
    this.setLimitDates();
    this.alertOptionsDomicile.Type = 'danger';
    this.alertOptionsDomicile.Message = this.languageConfig[this._appLanguage.Code].inputs.errors.domicile;
  }

  ngOnDestroy() {
    if (this._updateAlert) {
      this._store.dispatch(new authActions.RemoveAuthAlert({ action: userActions.UPDATE_USER }));
    }
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getGenders() {
    this._store.dispatch(new genderActions.LoadGenders({ languageId: this._appLanguage.Id.toString() }));
  }

  setLimitDates() {
    const today = new Date();
    this.limitDates = {
      min: {
        year: today.getFullYear() - 78,
        month: 1,
        day: 1
      },
      max: {
        year: today.getFullYear(),
        month: today.getUTCMonth() + 1,
        day: today.getUTCDay()
      }
    };
  }

  handleAddressChange(address: any) {
    const addressComponents = address.address_components;
    let country = addressComponents.find(component => component.types.includes('country'));
    let state = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
    let city = addressComponents.find(component => component.types.includes('locality'));
    let street = addressComponents.find(component => component.types.includes('route'));
    let streetNumber = addressComponents.find(component => component.types.includes('street_number'));
    let suburb = addressComponents.find(component => component.types.includes('sublocality_level_1'));
    let zipCode = addressComponents.find(component => component.types.includes('postal_code'));
    if (country && state && city && street && streetNumber && zipCode) {
      country = country.long_name;
      state = state.long_name;
      city = city.long_name;
      zipCode = zipCode.short_name;
      suburb = suburb ? suburb.short_name : '';
      street = street.short_name;
      streetNumber = streetNumber.short_name;
      this.setAddressForm(country, state, city, zipCode, suburb, street, streetNumber);
      this.alertOptionsDomicile.Status = false;
    } else {
      this.alertOptionsDomicile.Status = true;
    }
  }

  setAddressForm(country, state, city, zipCode, suburb, street, streetNumber) {
      this.setFormValue('Country', country);
      this.setFormValue('State', state);
      this.setFormValue('Town', city);
      this.setFormValue('PostalCode', zipCode);
      this.setFormValue('Suburb', suburb);
      this.setFormValue('Street', street);
      this.setFormValue('NumExt', streetNumber);
  }

  setFormValue(key: string, value: string) {
    this.form.controls[key].setValue(value);
  }

  onFileSelected(event, type) {
    this._file = <File>event.target.files[0];
    const options = {
      FileKey: 'userImage',
      FileName: `${this.user.Email}`,
      Token: this._jwt,
      MimeType: 'image/png',
      UploadUrl: `http://localhost:3000/api/shared/uploadUserImage/${this.user.Oid}`,
      ResponseKey: 'fullPath',
      ButtonText: 'Upload Picture',
      FileType: type
    };
    this.uploadWebFile(options);
  }

  uploadWebFile(options) {
    const uploadData = new FormData();
    uploadData.append(options.FileKey, this._file, options.FileName);
    this._http.post(options.UploadUrl, uploadData, {
      params: {
        FileType: options.FileType
      }
    }).toPromise().then(response => {
      this.fileUploaded.emit(response[options.ResponseKey]);
    });
  }

  async updateProfile() {
    const user: User = { ...this.form.value };
    user.Oid = this.user.Oid;
    user.Birthdate = new Date(user.Birthdate.year, user.Birthdate.month - 1, user.Birthdate.day);
    user.Phone = JSON.stringify(user.Phone);
    this._store.dispatch(new userActions.UpdateUser({
      oid: user.Oid,
      user,
      finishedProcessOid: this._pendingProcess.Oid
    }));
  }
}
