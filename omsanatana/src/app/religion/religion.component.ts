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

@Component({
  selector: 'app-religion',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,NzSelectModule,NzFormModule,NzTreeModule],
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

  constructor(private religiousservice:ReligiousService,private router:Router, private dialog:MatDialog,private route:ActivatedRoute, private fb:FormBuilder,private cdr: ChangeDetectorRef ,private sanitizer: DomSanitizer) {}








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



  
  this.religiousservice.categeories().subscribe(
    (response: any) => {
      const categories = response.results;
      this.nodes = this.createNodeTree(categories);


      this.nodes.sort((a, b) => a.title.localeCompare(b.title));
      
      if (this.selectedCategoryId) {
        this.fetchCategoryData(this.selectedCategoryId);
      }
    },
    (err: any) => console.error('Error loading categories:', err) 
  );
  // this.fetchDefaultCategoryData();

}




onCategoryClick(event: NzFormatEmitEvent): void {
  const node: NzTreeNode = event.node!;
  this.selectedCategoryId = node.key;

  console.log(this.selectedCategoryId, "Category clicked");

  // this.router.navigate(["organizations", this.selectedCategoryId]);

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



fetchCategoryData(categoryIdentifier: string): void {
  this.religiousservice.getbydata(categoryIdentifier).subscribe(
    (data: any) => {
      this.categoryData = data; 
      console.log('Fetched category data:', this.categoryData);
    },
    (err: any) => console.error('Error fetching category data:', err)
  );
}



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


    'Vedic Science and Traditions': ['Astrology', 'Astronomy', 'Ayurveda', 'Yoga',  'Vasthu',],

    'Religion': ['Hinduism', 'Buddhism', 'Jainism', 'Sikhism'],


  };



// highlightText(text: string): string {
//   let highlightedText = text;

//   Object.keys(this.keywords).forEach(selectedCategoryId => {
//     this.keywords[selectedCategoryId].forEach((keyword: string) => {
//       const regex = new RegExp(`(${this.escapeRegExp(keyword)})`, 'gi');
//       highlightedText = highlightedText.replace(regex, `<a href="religion/${selectedCategoryId}" >$1</a>`);
      
//     });
//   });

//   return highlightedText;
// }

private escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


highlightText(text: string): SafeHtml {
  const allKeywords = Object.keys(this.keywords).flatMap(key => this.keywords[key]);
  const regex = new RegExp(`\\b(${allKeywords.join('|')})\\b`, 'gi');

  const highlightedText = text.replace(regex, (matched) => {
    return `<span class="highlight-keyword" style="color: #ff5500; font-weight: bold; cursor: pointer;">${matched}</span>`;
  });

  return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
}


handleKeywordClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const keyword = target.innerText; 

  if (this.keywords && Object.values(this.keywords).flat().includes(keyword)) {
    this.navigateToCategory(keyword); 
  }
}

navigateToCategory(keyword: string) {
  this.router.navigate(['/religion', keyword]); 
}









}



