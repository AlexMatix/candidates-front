import {Injectable} from '@angular/core';
import {MORENA_THEME, Theme, VERDE_TEAM} from '../util/theme';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private active: Theme = MORENA_THEME;
    private availableThemes: Theme[] = [MORENA_THEME, VERDE_TEAM];

    constructor() {
    }

    setActiveTheme(theme: Theme) {
        this.active = theme;
        Object.keys(this.active.properties).forEach(property => {
            document.documentElement.style.setProperty(property, this.active.properties[property]);
        })
    }
}
