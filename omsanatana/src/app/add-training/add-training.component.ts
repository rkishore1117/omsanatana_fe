import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
// import { OrganizationsService } from '../services/organizations.service';
import { state } from '@angular/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NzUploadModule,NzUploadFile,NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';
import { AuthenticationService } from '../services/authentication.service';
import { NotificationHelper } from '../commons/notification';
import { TrainingService } from '../services/training.service';
import { MemberProfileComponent } from '../member-profile/member-profile.component';
import { TrainerUpdateComponent } from '../trainer-update/trainer-update.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-training',
  standalone: true,
  imports: [
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    NzUploadModule
  ],
    templateUrl: './add-training.component.html',
  styleUrl: './add-training.component.css'
})
export class AddTrainingComponent {


  organizationForm!: FormGroup;
  templeCategoryOptions: any[] = [];
  templePriorityOptions: any[] = [];
  templeStyleOptions: any[] = [];
  containsLocationDetails = false;
  countries: any;
  templeCountryOptions: any[] = [];
  templeStateOptions: any[] = [];
  templeDistrictOptions: any[] = [];
  templeMandalOptions: any[] = [];
  templeVillageOptions: any[] = [];
  countryID:any[]=[];
  formGroup: any;
  bannerFileList: NzUploadFile[] = [];
  imageLocation: string = '';
  fileList: NzUploadFile[] = [];
  villagedata: any;
  villageid:any;
  selectedLocationId:any;
  ContinentOptions:any[]=[];
  countrydata: any;
  districtdata:any;
  CountryOptions: any[]=[];
  StateOptions: any[]=[];
  DistrictOptions: any[]=[];
  formDisabled = false;



  combinedCategoryOptions: any[] = [];
  subcategoryToCategoryMap: { [key: string]: string } = {}; 
  CategoryOptions: any[] = [];

  // formGroup:any;

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
private trainingservice:TrainingService,
    private formBuilder: FormBuilder,
    private router:Router,
    private dialog:MatDialog,
    private notificationHelper: NotificationHelper,
  ) {

    this.organizationForm = this.fb.group({  

      object_id:['', [Validators.required]],
      name: ['', [Validators.required]],
      desc: ['',[Validators.required]],
      // image: ['', [Validators.required]],
      image: ['', [Validators.required]],
      location: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      start_date: ['', [Validators.required]],

      trainer_name: ['', Validators.required],
      contact_details: ['', Validators.required],
      video: [''],
      training_type: ['offline',Validators.required],
      geo_site: ['DISTRICT'],
      category: ['', Validators.required],     
      user:localStorage.getItem('user'),
      continent: ['', [Validators.required]],      
      status: ['PENDING'],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      sub_category: [''],
      training_link: ['',Validators.required],
      // is_member:'true'
      // start_time: ['', [Validators.required]],

      // end_time: ['', [Validators.required]],


     });
   }

  ngOnInit() {
    this.fetchAllCategories();



    this.trainingservice.getContinents().subscribe(
      (res) => {
        // console.log(res,'kishsdhsjfdskfb'); 
        if (res && Array.isArray(res)) {
          this.ContinentOptions = res.map((continent: any) => ({
            label: continent.name,
            value: continent._id
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        } else {
          console.error("Response is not in expected format", res);
        }
      },
      (err) => {
        console.error(err);
      }
    );
    



    this.organizationForm.get('continent')?.valueChanges.subscribe((continentID) => {
      console.log(continentID, "wdefrgh");
      if (continentID) {
        this.selectedLocationId = continentID; 
        console.log(continentID, "zaxsdfg");
        this.trainingservice.getCountries(continentID).subscribe(
          data => {
            this.countrydata = data;
    
            console.log(this.countrydata, "this.countrydata");
    
            if (this.countrydata && typeof this.countrydata === 'object' && this.countrydata.countries && Array.isArray(this.countrydata.countries)) {
              this.CountryOptions = this.countrydata.countries.map((country: any) => ({
                label: country.name,
                value: country._id
              })).sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));
              console.log(this.CountryOptions, "2345678");
            } else {
              console.error("Response is not in expected format", this.countrydata);
            }
          },
          (err) => {
            console.error(err);
          }
        );
      }
    });
    

    this.organizationForm.get('country')?.valueChanges.subscribe((countryID) => {
      if (countryID) {
        this.selectedLocationId = countryID; 
        this.trainingservice.getStates(countryID).subscribe(
          (data) => {
            this.countrydata = data;
    
            console.log(this.countrydata, "this.countrydata");
    
            if (this.countrydata && typeof this.countrydata === 'object' && this.countrydata.states && Array.isArray(this.countrydata.states)) {
              this.StateOptions = this.countrydata.states.map((state: any) => ({
                label: state.name,
                value: state._id
              })).sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));
              console.log(this.StateOptions, "State Options");
            } else {
              console.error("Response is not in expected format", this.countrydata);
            }
          },
          (err) => {
            console.error(err);
          }
        );

      }
    });
    

    this.organizationForm.get('state')?.valueChanges.subscribe((stateID) => {
      if (stateID) {
        this.selectedLocationId = stateID; 

        this.trainingservice.getDistricts(stateID).subscribe(
          (data) => {
            this.districtdata = data;
    
            console.log(this.districtdata, "this.districtdata");
    
            if (this.districtdata && typeof this.districtdata === 'object' && this.districtdata.districts && Array.isArray(this.districtdata.districts)) {
              this.DistrictOptions = this.districtdata.districts.map((district: any) => ({
                label: district.name,
                value: district._id
              })).sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));
              console.log(this.DistrictOptions, "District Options");
            } else {
              console.error("Response is not in expected format", this.districtdata);
            }
          },
          (err) => {
            console.error(err);
          }
        );
      } else {
      }
    });

    this.organizationForm.get('district')?.valueChanges.subscribe(districtID => {
      if (districtID) {
        this.selectedLocationId = districtID; 
        console.log('district ID selected:', this.selectedLocationId);
      } else {
      }
    });
    
  }



  // onSubmit() {
  //   if (this.organizationForm.valid) {
  //     const formValue = { ...this.organizationForm.value };
      
  
  //     const selectedCategory = formValue.category;
  //     const selectedCategoryOption = this.combinedCategoryOptions.find(option => option.value === selectedCategory);
  
  //     if (selectedCategoryOption?.isSubcategory) {
  //       formValue.sub_category = selectedCategory;
  //       formValue.category = this.subcategoryToCategoryMap[selectedCategory];
  //     } else {
  //       formValue.sub_category = '';
  //     }
  
  //     console.log('Form value before submitting:', formValue);
  //     this.isLoading = true;
  
  //     this.trainingservice.addtraining(formValue).subscribe(
  //       (response) => {
  //         console.log('Training added successfully:', response);
  //         this.notificationHelper.showSuccessNotification('Add Training Success', '');
  //         this.resetForm();
  //       },
  //       (error) => {
  //         if (error.status === 400) {
  //           console.error('Error adding Training:', error);
  //           this.notificationHelper.showErrorNotification(
  //             'You are not a member. Please update your profile and become a member first'
  //           );
  //           this.openMemberDialog();
  //         } else if (error.status === 403) {
  //           console.error('Error adding Training:', error);
  //           this.notificationHelper.showErrorNotification('Only ADMIN users can create training records.');
  //           this.adminTrainerDialog();  // Open the Admin dialog here
  //         } else {
  //           console.error('Error adding Training:', error);
  //           this.notificationHelper.showErrorNotification('Training not added.');
  //         }
  //       }
        
  //     );
  //   } else {
  //     this.organizationForm.markAllAsTouched();
  //     console.log('Form is invalid.');
  //   }
  // }

  loading: boolean = false;

  
  onSubmit() {
    if (this.organizationForm.valid) {
      this.loading = true; // Start loader

      const formValue = { ...this.organizationForm.value };
      
      const selectedCategory = formValue.category;
      const selectedCategoryOption = this.combinedCategoryOptions.find(option => option.value === selectedCategory);
  
      if (selectedCategoryOption?.isSubcategory) {
        formValue.sub_category = selectedCategory;
        formValue.category = this.subcategoryToCategoryMap[selectedCategory];
      } else {
        formValue.sub_category = '';
      }

      
  
      console.log('Form value before submitting:', formValue);
  
      // Show loader
  
      this.trainingservice.addtraining(formValue).subscribe(
        (response) => {
          console.log('Training added successfully:', response);
          this.notificationHelper.showSuccessNotification('Add Training Success', '');
          this.resetForm();
          this.loading = false;

        },
        (error) => {
          if (error.status === 400) {
            console.error('Error adding Training:', error);
            this.notificationHelper.showErrorNotification(
              'You are not a member. Please update your profile and become a member first'
            );
            this.loading = false;

            this.openMemberDialog();
          } else if (error.status === 403) {
            console.error('Error adding Training:', error);
            this.notificationHelper.showErrorNotification('Only ADMIN users can create training records.');
            this.adminTrainerDialog();  // Open the Admin dialog here
          } else {
            console.error('Error adding Training:', error);
            this.notificationHelper.showErrorNotification('Training not added.');
          }
        },
        () => {
          this.loading = false;

        }
      );
    } else {
      this.organizationForm.markAllAsTouched();
      console.log('Form is invalid.');
    }
  }
  
  openMemberDialog(): void {
    console.log('Opening member form dialog');
    const dialogRef = this.dialog.open(MemberProfileComponent, {
      data: { displayName: 'signup' },
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
    });
  
    dialogRef.afterClosed().subscribe(() => {
    });
  }
  

  adminTrainerDialog(): void {
    console.log('Opening admin trainer update dialog');
    const dialogRef = this.dialog.open(TrainerUpdateComponent, {
      data: { displayName: 'ADMIN' },
      autoFocus: true, 
      backdropClass: 'dialog-backdrop', 
      disableClose: false 
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Admin trainer dialog closed', result);
      
    });
  }
  


  resetForm() {
    this.organizationForm.reset();
    this.fileList = [];
    this.bannerFileList = [];
    this.videoFileList =[];

    this.organizationForm.patchValue({
  image: '',
  video:''
    });
  }


  
  // fetchAllCategories(): void {
  //   this.trainingservice.getTrainingCategories().subscribe(
  //     (res) => {

  //       if (res && Array.isArray(res)) {
  //         this.CategoryOptions = res.map((subcategory: any) => ({
  //           label: subcategory.name,  
  //           value: subcategory._id    
  //         }));
  //       } else {
  //         console.error("Invalid response format for subcategories");
  //       }
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }
  
  fetchAllCategories(): void {
    this.trainingservice.getTrainingCategories().subscribe(
      (res) => {
        if (res && Array.isArray(res)) {
          const categories = res.map((category: any) => ({
            label: category.name,  
            value: category._id    
          }));
          

          this.trainingservice.gettrainingsubCategoriesadd().subscribe(
            (subRes) => {

              if (subRes && Array.isArray(subRes)) {
                const subCategories = subRes.map((subcategory: any) => {
               
                  this.subcategoryToCategoryMap[subcategory._id] = subcategory.category;
                  return {
                    label: `${subcategory.name}`,   
                    value: subcategory._id,        
                    isSubcategory: true             
                  };
                });
                
        
                this.combinedCategoryOptions = [...categories, ...subCategories];
              } else {
                console.error("Invalid response format for subcategories");
              }
            },
            (err) => {
              console.error(err);
            }
          );
        } else {
          console.error("Invalid response format for categories");
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }
  subCategoryOptions: any[] = [];

  fetchAllSubCategories(): void {
    this.trainingservice.gettrainingsubCategoriesadd().subscribe(
      (res) => {

        if (res && Array.isArray(res)) {
          this.subCategoryOptions = res.map((subcategory: any) => ({
            label: subcategory.name,  
            value: subcategory._id    
          }));
        } else {
          console.error("Invalid response format for subcategories");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }


  onCategoryChange(event: any): void {
    const selectedCategory = event.target.value;
    const selectedCategoryOption = this.combinedCategoryOptions.find(option => option.value === selectedCategory);
    
    if (selectedCategoryOption?.isSubcategory) {
      this.organizationForm.get('category')?.clearValidators();
      this.organizationForm.get('category')?.updateValueAndValidity();
      this.organizationForm.get('sub_category')?.setValue(selectedCategory);
    } else {
      this.organizationForm.get('sub_category')?.setValue('');
      this.organizationForm.get('category')?.clearValidators();
      this.organizationForm.get('category')?.updateValueAndValidity();
    }
  
    console.log('Selected Category Option:', selectedCategoryOption);
  }
  
  selectedCategoryLabel: string | undefined;


//   handleBannerFileChange(info: NzUploadChangeParam): void {
//     this.handleUpload(info, 'image');
//   }

//   handleUpload(info: NzUploadChangeParam, formControlName: string): void {
//     const fileList = [...info.fileList];

//     fileList.forEach((file: NzUploadFile) => {
//       this.getBase64(file.originFileObj!, (base64String: string) => {
//         file['base64'] = base64String;
//         this.organizationForm.patchValue({ image: base64String });
        
//       });
//     });

//     this.organizationForm.get(formControlName)?.setValue(fileList);

//     if (formControlName === 'image') {
//       this.fileList = fileList;
//     } else if (formControlName === 'image') {
//       this.bannerFileList = fileList;
//     }
//    console.log('image submit', this.organizationForm.value);
//   }


//   getBase64(file: File, callback: (base64String: string) => void): void {
//     const reader = new FileReader();
//     reader.onload = () => {
//         let base64String = reader.result as string;
//         base64String = base64String.split(',')[1];
//         // console.log('Base64 string:', base64String);
//         callback(base64String);
//     };
//     reader.readAsDataURL(file);
// }


// handleBannerFileRemove(): void {
//   if (this.bannerFileList.length === 0) {
//     this.bannerFileList = [];
//   }
// }

handleBannerFileChange(info: NzUploadChangeParam): void {
  this.handleUpload(info, 'image');
}

// Handle video upload
handleVideoFileChange(info: NzUploadChangeParam): void {
  this.handleUpload(info, 'video');
}

// handleUpload(info: NzUploadChangeParam, formControlName: string): void {
//   const fileList = [...info.fileList];

//   fileList.forEach((file: NzUploadFile) => {
//     // If uploading an image, convert it to base64 and set in form
//     if (formControlName === 'image') {
//       this.getBase64(file.originFileObj!, (base64String: string) => {
//         file['base64'] = base64String;
//         this.organizationForm.patchValue({ image: base64String });  // Store base64 string for image
//       });
//     } 
//     // If uploading a video, just set the file reference without converting to base64
//     else if (formControlName === 'video') {
//       this.organizationForm.patchValue({ video: file.originFileObj });  // Store file reference for video
//     }
//   });

//   // Update file list for the respective form control
//   this.organizationForm.get(formControlName)?.setValue(fileList);

//   // Set fileList variables based on the type of upload
//   if (formControlName === 'image') {
//     this.bannerFileList = fileList;  // for images
//   } else if (formControlName === 'video') {
//     this.videoFileList = fileList;  // for videos
//   }
//   console.log(`${formControlName} submit`, this.organizationForm.value);
// }

// getBase64(file: File, callback: (base64String: string) => void): void {
//   const reader = new FileReader();
//   reader.onload = () => {
//     let base64String = reader.result as string;
//     base64String = base64String.split(',')[1];  // Remove the data prefix to get the pure base64 string
//     callback(base64String);
//   };
//   reader.readAsDataURL(file);
// }

// Handle file removal for images
handleBannerFileRemove(): void {
  if (this.bannerFileList.length === 0) {
    this.bannerFileList = [];
  }
}

// Handle file removal for videos
// handleVideoFileRemove(): void {
//   if (this.videoFileList.length === 0) {
//     this.videoFileList = [];
//   }
// // }
// handleVideoFileChange(info: NzUploadChangeParam): void {
//   this.handleUpload(info, 'video');
// }

handleUpload(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  fileList.forEach((file: NzUploadFile) => {
    if (formControlName === 'image') {
      // If uploading an image, convert to base64
      this.getBase64(file.originFileObj!, (base64String: string) => {
        file['base64'] = base64String;
        this.organizationForm.patchValue({ image: base64String });
      });
    } else if (formControlName === 'video') {
      // Convert the video to base64
      this.getBase64(file.originFileObj!, (base64String: string) => {
        file['base64'] = base64String;
        this.organizationForm.patchValue({ video: base64String });  // Save base64 string for the video
      });
    }
  });

  // Update file list for the respective form control
  this.organizationForm.get(formControlName)?.setValue(fileList);

  // Set fileList variables based on the type of upload
  if (formControlName === 'image') {
    this.bannerFileList = fileList;
  } else if (formControlName === 'video') {
    this.videoFileList = fileList;
  }
  console.log(`${formControlName} submit`, this.organizationForm.value);
}

getBase64(file: File, callback: (base64String: string) => void): void {
  const reader = new FileReader();
  reader.onload = () => {
    const base64String = (reader.result as string).split(',')[1];  // Get pure base64 string
    callback(base64String);
  };
  reader.readAsDataURL(file);
}

handleVideoFileRemove(): void {
  this.videoFileList = [];
  this.organizationForm.patchValue({ video: null });  // Remove video from the form
}
videoFileList: NzUploadFile[] = [];   // For video upload



  onVideoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Video = e.target.result.split(',')[1]; 
        console.log(base64Video,'ddddfdfffffffffffffffffffffffffffffffffffffffff')
        this.organizationForm.patchValue({
          video: base64Video  
        });
      };
      reader.readAsDataURL(file);  
    }
  }

  // onVideoSelected(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const base64Video = e.target.result.split(',')[1]; 
  //       console.log(base64Video);
  //       this.organizationForm.patchValue({
  //         video: base64Video  
  //       });
  //     };
  //     reader.readAsDataURL(file);  
  //   }
  // }
  


}
