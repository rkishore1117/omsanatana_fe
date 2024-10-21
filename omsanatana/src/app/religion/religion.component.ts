import { ChangeDetectorRef, Component } from '@angular/core';
import { HomeService } from '../services/home.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReligiousService } from '../services/religious.service';
import { FormBuilder } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { FormGroup, FormsModule,Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer ,SafeHtml } from '@angular/platform-browser';
import { NgxSpinnerModule,NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-religion',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,NzSelectModule,NzFormModule,NzTreeModule,NgxSpinnerModule],
  templateUrl: './religion.component.html',
  styleUrl: './religion.component.css'
})
export class ReligionComponent {
  categories: any[] = [];
  subcategories: any[] = [];
  // categoryId:any[] = [];
  selectedCategoryId:any;
  nodes: NzTreeNodeOptions[] = [];
  searchValue: string = '';
  categoryData: any;
  isSideMenuOpen = false;
  categoryId: any;
  lastSelectedCategoryId: string | null = null;

  constructor(private religiousservice:ReligiousService,private router:Router, private dialog:MatDialog,private route:ActivatedRoute, private fb:FormBuilder,private cdr: ChangeDetectorRef ,private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
  ) {}


ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.categoryId = +id; 
      this.fetchCategoryData(this.categoryId); 
    }

    
  });
  
  this.route.paramMap.subscribe(params => {
    const categoryId = params.get('id');
    if (categoryId) {
      this.selectedCategoryId = categoryId;
      this.fetchCategoryData(categoryId); 
    }
  });

  this.selectedCategoryId = this.route.snapshot.paramMap.get('id');



  this.isLoading = true;
  this.religiousservice.categeories().subscribe(
    (response: any) => {
      const categories = response.results;
      this.nodes = this.createNodeTree(categories);


      this.nodes.sort((a, b) => a.title.localeCompare(b.title));
      
      if (this.selectedCategoryId) {
        this.fetchCategoryData(this.selectedCategoryId);
      }
      this.isLoading = false;
    },
    (err: any) => console.error('Error loading categories:', err) 
  );
  this.isLoading = false;
  // this.fetchDefaultCategoryData();

}




onCategoryClick(event: NzFormatEmitEvent): void {
  const node: NzTreeNode = event.node!;
  this.selectedCategoryId = node.key;

  console.log(this.selectedCategoryId, "Category clicked");


  if (this.selectedCategoryId === 'AllTemples') {
    this.selectedCategoryId = null; 
    
    return; 
  }
  this.lastSelectedCategoryId = this.selectedCategoryId;
  
  this.fetchCategoryData(this.selectedCategoryId);

  if (!node.isExpanded && node.children.length === 0 && !node.isLeaf) {
    const nodeType = node.origin['data']?.type;

    if (nodeType === 'category') {
      this.loadSubcategories(node, this.selectedCategoryId);
    } else if (nodeType === 'subcategory') {
      this.loadMinisubcategories(node, this.selectedCategoryId);
    } else if (nodeType === 'minisubcategory') {
      this.loadSpecificCategories(node, this.selectedCategoryId);
    }
  } else {
    node.isExpanded = !node.isExpanded; 
  }
}

isLoading = false;

fetchCategoryData(categoryIdentifier: string): void {
  this.isLoading = true; // Set loading to true before making the request
  
  this.religiousservice.getbydata(categoryIdentifier).subscribe(
    (data: any) => {
      this.categoryData = data; 
      console.log('Fetched category data:', this.categoryData);
      this.isLoading = false; // Set loading to false after data is fetched
    },
    (err: any) => {
      console.error('Error fetching category data:', err);
      this.isLoading = false; // Ensure loading is false even on error
    }
  );
}


// fetchCategoryData(categoryIdentifier: string): void {
//   this.spinner.show();
//   this.religiousservice.getbydata(categoryIdentifier).subscribe(
//     (data: any) => {
//       this.categoryData = data; 
//       console.log('Fetched category data:', this.categoryData);
//       this.spinner.hide();
//     },
//     (err: any) => console.error('Error fetching category data:', err)
//   );
//   this.spinner.hide();
// }

loadSubcategories(node: NzTreeNode, categoryId: string | null): void {
  if (!categoryId) {
    console.error('Category ID is null or undefined.');
    return;
  }

  this.religiousservice.subcategeories(categoryId).subscribe(
    (response: any[]) => {  
      console.log('Subcategories response:', response);  

      const children = response.map(sub => ({
        title: sub.name,  
        key: sub._id,    
        isLeaf: false, 
        data: { type: 'subcategory' } 
      }));

      node.addChildren(children);
      node.isExpanded = true;
    },
    (err: any) => console.error('Error loading subcategories:', err) 
  );
}


loadMinisubcategories(node: NzTreeNode, subcategoryId: string | null): void {
  if (!subcategoryId) {
    console.error('Subcategory ID is null or undefined.');
    return;
  }

  this.religiousservice.minisubcategeories(subcategoryId).subscribe(
    (response: any[]) => {  
      console.log('Minisubcategories response:', response);  

      const minisubcategories = response.map(miniSub => ({
        title: miniSub.name,  
        key: miniSub._id,    
        isLeaf: false, 
        data: { type: 'minisubcategory' } 
      }));

      node.addChildren(minisubcategories);
      node.isExpanded = true;
    },
    (err: any) => console.error('Error loading minisubcategories:', err) 
  );
}


loadSpecificCategories(node: NzTreeNode, minisubcategoryId: string | null): void {
  if (!minisubcategoryId) {
    console.error('Minisubcategory ID is null or undefined.');
    return;
  }

  this.religiousservice.specificminisubcategeories(minisubcategoryId).subscribe(
    (response: any[]) => {  
      console.log('Specific categories response:', response);  

      const specificCategories = response.map(specCat => ({
        title: specCat.name,  
        key: specCat._id,    
        isLeaf: true, 
        data: { type: 'specificcategory' } 
      }));

      node.addChildren(specificCategories);
      node.isExpanded = true;
    },
    (err: any) => console.error('Error loading specific categories:', err) 
  );
}

createNodeTree(data: any[]): NzTreeNodeOptions[] {
  return data.map(item => ({
    title: item.name,
    key: item._id,
    isLeaf: false,
    data: { type: 'category' } 
  }));
}



  fetchDefaultCategoryData(): void {
    const defaultCategoryId = '79af0d7e-9cb1-4c74-942b-06ce1dad9883'; 
    this.religiousservice.getbydata(defaultCategoryId).subscribe(
      (data: any) => {
        this.categoryData = data;
        console.log('Fetched default category data:', this.categoryData);
      },
      (err: any) => console.error('Error fetching default category data:', err)
    );
  }



  toggleSideMenu() {
    this.isSideMenuOpen = !this.isSideMenuOpen;


    if (!this.isSideMenuOpen && this.lastSelectedCategoryId) {
      this.selectedCategoryId = this.lastSelectedCategoryId;
      this.fetchCategoryData(this.selectedCategoryId);
    }
  }







  keywords: any = {

    'Ancient Literature': ['Smriti', 'Shruti','Rigveda'],
    'Shruti':['Atharvaveda','Samaveda','Yajurveda','Rigveda'],
    'Smriti':['Ithihas(Epic)','Up-Puranas','Puranas','Dharshana','Upavedas','Vedangas'],
    'Rigveda':['RigVeda-Upanishad','RigVeda-Aranyak','RigVeda-Brahamana','RigVeda-Samhita'],
    'Yajurveda':['YajurVeda-Shukla','YajurVeda-Upanishad','YajurVeda-Aranyak','YajurVeda-Brahmana','YajurVeda-Samhita'],
    'Samaveda':['SamaVeda-Upanishad','SamaVeda-Aranyak','SamaVeda-Brahmana','SamaVeda-Samhita'],
    'Atharvaveda':['AtharvaVeda-Upanishad','AtharvaVeda-Aranyak','AtharvaVeda-Brahmana','AtharvaVeda-Samhita'],
    'Vedangas':['Chhanda','Arthashashtra(Economics)','Jyotisha(Astrology)','Kanda(Metre)','Nirukta(Glossary)','Vyakarana(Grammer)','Kalpa(Religious Rights)','Shikha(Phonetics)'],
    'Upavedas':['Arthveda Veda(Economics and politics)','Gandharva Veda(Art and Music)','Gandharva Veda(Art and Music)','Ayurveda(Health Science)'],
    'Puranas':['Brahmanda Purana','Garuda Purana','Matshya Purana','Kurma Purana','Vamana Purana','Skanda Purana','Varaha Purana','Linga Purana','Brahma vaivartha Purana','Bhavishya Purana','Agni Purana','Markandeya Purana','Narada Purana','Bagavath Purana','Vayu Purana','Vishnu purana','Padma Purana','Brahma Purana','Puranas'],
    'Up-Puranas':['Samba Purana','Devibhagavata Purana','Kalika Purana','Lakhunaradheeya Purana','Harivamsa Purana','Vishnudharmmoththara Purana','Kaliki Purana','Mulgala Purana','Aadhi Purana',' Aathma Purana', 'Brahma Purana', 'Vishnudharma Purana','Narasimha Purana','Kriyaayoga Purana','Surya Purana', 'Bruhat Naradheeya Purana', 'Prushoththma Purana','Bruhat Vishnu Purana'],
    'Ithihas(Epic)':['Bhagvat Gita','Mahabharatha','Ramayana'],
    // Vedic Science and Traditions
    'Vedic Science and Traditions': [ 'Astronomy', 'Ayurveda', 'Yoga',  'Vasthu','Astrology', ],
    'Astrology':["Chinese astrology","Judicial astrology","Locational astrology","Mayan astrology","Natal astrology","Relationship astrology","Uranian astrology","Vedic astrology"],
    'Ayurveda': ["Agada Tantra (Toxicology)","Ayurvedic Nutrition (Ahara Chikitsa)","Bhuta Vidya (Psychiatry and Mental Health)","Doshas in Ayurveda (Vata, Pitta, Kapha)","Kaumarbhritya (Pediatrics and Obstetrics)","Kayachikitsa (Internal Medicine)","Panchakarma","Rasayana (Rejuvenation and Anti-Aging)","Shalakya Tantra (ENT and Eye Disorders)","Shalya Tantra (Surgery)","Swastavritta (Preventive Medicine and Lifestyle Management)","Vajikarana (Aphrodisiacs and Fertility)"],
    "Yoga": ["Ashtanga Yoga","Bhakti Yoga","Hatha Yoga","Integral Yoga","Jivamukti Yoga","Jnana Yoga","Karma Yoga","Kundalini Yoga","Raja Yoga","Tantra Yoga","Yin Yoga"],
    "Vasthu": ["Agricultural Vastu (Krishi Vastu)","Commercial Vastu","Corporate Vastu","Educational Vastu","Health Care Vastu (Hospital Vastu)","Industrial Vastu","Plot Vastu","Residential Vastu (Griha Vastu)","Temple Vastu (Mandir Vastu)","Vastu for Hotels & Restaurants"],
    "Astronomy":["Calculation of Time (Kala)","Calendrical Astronomy","Cosmic Cycles and Yugas","Eclipse Prediction","Graha (Planets)","Nakshatras (Lunar Mansions)","Parallax and Distance Measurement","Siddhantic Astronomy (Siddhanta Jyotisha)","Surya Siddhanta"],
    // Religion
    'Religion': ['Hinduism', 'Buddhism', 'Jainism', 'Sikhism'],
    'Hinduism': ['Festivals', 'Functions', 'Pujas', "Famous Guru's and Saints", 'Temples', 'Muhurtas', 'Philosophy', 'Cultural Arts', ],
   // Hinduism
   'Festivals': ['Ugadi(Baisakhi )', 'Sri Rama Navami', 'Hanuman Jayanti', 'Janmastami', 'Guru Purnima', 'Ganesh Chaturti','Navaratri','Diwali','Makara Sankranthi','Maha Shivarathri','Holi','Raksha Bandhan','Ekadashi','Dhnateras','Chhath Puja','Basant Panchami','Karva Chauth','Onam'],
   'Functions': ['Garbhadan(Conception)','Pumsavana(Engendering a male issue)','Simantonayana (Hair-parting)','Jatakarma (Birth rituals)','Namkaran (Name-giving)','Nishkrama (First outing)','Annaprashan (First feeding)','Chudakarma (Chaul) (Shaving of head)','Karnavedh (Piercing the earlobes)','Vidyarambh (Learning the alphabet)','Upanayan (Yagnopavit)','Vedarambh (Beginning Vedic study)','Keshant (Godaan) (Shaving the beard)','Samavartan (End of Studentship)','Vivaha','Antyesthi (Death rites)'],
   'Pujas': [' Ganesh Pooja','Lakshmi Pooja','Durga Pooja','Shiva Pooja(Mahashivaratri)','Vishnu Pooja','Saraswati Pooja(Vasant Panchami )','Satyanarayana Pooja','Hanuman Pooja(Hanuman Jayanti)','Navagraha Pooja','Kali Pooja','Chandi Homa/Pooja','Vastu Pooja','Pitru Pooja (Shraddha)','Gayatri Pooja','Karthika Deepam Pooja'],
   "Famous Guru's and Saints":['Adi Shankaracharya (8th Century CE)','Rishi Vyasa','Patanjali','Ramanujacharya (1017–1137 CE)','Sant Kabir (1440–1518 CE)','Madhvacharya (1238–1317 CE)','Sant Tulsidas (1532–1623 CE)','Sant Mirabai (1498–1547 CE)','Sant Eknath (1533–1599 CE)','Swami Vivekananda (1863–1902 CE)','Ramakrishna Paramahamsa (1836–1886 CE)','Sri Aurobindo (1872–1950 CE)','Sri Ramana Maharshi','DATTATREYA','Dayananda Saraswati'],
   'Temples':['Ruins','Ayyappa Swamy','Asta Vinayaka','Brahma','Bala Rama','Chota Chardham','Chardham','Chandi Mata','Durga Mata','Danteswari Mata','Gramadevata','Gayatri Mata','Ganapati','Hanuman','Iskon','Janaki','Jyothi Lingas','Jagannath','Kala Birava','Kali Mata','Muththmari Amman','Maha Lakshmi','Murugan','Maha Sakthi peetas','Maha Vishnu','Narasimha', 'Nava Grahalu','Other Category','Pancha Bhutha','Pancha Kedar','Pancha Preyar','Shani','Sri Krishna','Shitla Mata','Swamy Narayan','Sathya Narayana Swamy','Sakthi Peetas','Sri Rama','Subramanya Swamy','Shiva','Saraswati','Veera Badhra','Venkateshwara Swamy','Antediluvian','Matam'],
   'Muhurtas': ['Tithi','Vaasara','Nakshatra','the yoga','Karan'],
   'Philosophy':['Samkhya (Kapila)','Yoga (Patanjali)','Nyaya (Gautama Muni)','Vaisheshika (Kanada)','Purva Mimamsa (Jaimini)','Vedanta'],
   'Cultural Arts': ['Dance','Music','Singing','Painting','Sculpture','Sewing','Embroidery','Dressing','Jewelry & Gems','Cooking - Eating - Drinking','Organic Food','Old Hindu Traditional - Festival Games','Games - Children Games','Ancient Martial Arts','Stories - Pancha Tantra Stories'],
   'Buddhism': ['Festivals', 'Functions', 'Pujas', "Famous Guru's and Saints", 'Temples', 'Muhurtas', 'Philosophy', 'Cultural Arts', ],
   'Jainism' : ['Festivals', 'Functions', 'Pujas', "Famous Guru's and Saints", 'Temples', 'Muhurtas', 'Philosophy', 'Cultural Arts', ],
    'Sikhism' : ['Festivals', 'Functions', 'Pujas', "Famous Guru's and Saints", 'Temples', 'Muhurtas', 'Philosophy', 'Cultural Arts', ],
// Buddhism


  };





highlightText(text: string): SafeHtml {
  const allKeywords = Object.keys(this.keywords).flatMap(key => this.keywords[key]);
  const regex = new RegExp(`\\b(${allKeywords.join('|')})\\b`, 'gi');  
  const highlightedText = text.replace(regex, (matched) => {
    return `<span class="highlight-keyword" style="color: #FF5500; font-weight: bold; cursor: pointer;">${matched}</span>`;
  });
  return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
}
handleKeywordClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const clickedKeyword = target.innerText.toLowerCase();  
  const matchedKeyword = Object.values(this.keywords)
    .flat()
    .find((keyword) => (keyword as string).toLowerCase() === clickedKeyword);  
  if (typeof matchedKeyword === 'string') {  
    this.navigateToCategory(matchedKeyword);  
  }
}
navigateToCategory(keyword: string) {
  this.router.navigate(['/religion', keyword]);
}




private escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}










}



