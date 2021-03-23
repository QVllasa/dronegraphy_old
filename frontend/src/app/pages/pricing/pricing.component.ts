import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'dg-pricing',
    templateUrl: './pricing.component.html',
    styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

    constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
        this.matIconRegistry.addSvgIcon(
            `rocket`,
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/rocket.svg')
        );
    }

    ngOnInit(): void {
    }

}
