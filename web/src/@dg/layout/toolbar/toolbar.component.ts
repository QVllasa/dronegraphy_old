import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {LayoutService} from '../../services/layout.service';
import {ConfigService} from '../../services/config.service';
import {NavigationService} from '../../services/navigation.service';
import {AuthenticationService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {OrderService} from '../../services/order.service';
import {UserService} from '../../services/user.service';
import {AnimationOptions} from 'ngx-lottie';
import {AnimationDirection, AnimationItem} from 'lottie-web';

@Component({
    selector: 'dg-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    @Input() collapsed: boolean;
    @HostBinding('class.shadow-b')

    options: AnimationOptions = {
        path: '/assets/animations/lottieflow-menu-nav-2.json',
        loop: false,
        autoplay: false,
        initialSegment: [0, 40]
    };

    private animationItem: AnimationItem;

    direction = true;

    constructor(private layoutService: LayoutService,
                public orderService: OrderService,
                public router: Router,
                public userService: UserService) {
    }

    ngOnInit() {

    }

    toggleSidenav() {
        this.layoutService.sidenavOpen$.value ? this.layoutService.closeSidenav() : this.layoutService.openSidenav();
    }

    animationCreated(animationItem: AnimationItem): void {
        this.animationItem = animationItem;
        this.animationItem.playSpeed = 2;
        this.layoutService.sidenavOpen$.subscribe(value => {
            // console.log(value);
            this.updateAnimation(value);
        });
    }

    updateAnimation(direction: boolean): void {
        if (direction){
            this.animationItem.setDirection(1);
            this.animationItem.play();
        }else {
            this.animationItem.setDirection(-1);
            this.animationItem.play();
        }
    }

}
