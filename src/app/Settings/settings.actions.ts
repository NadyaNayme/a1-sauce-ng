import { createAction, props } from '@ngrx/store';

export const updateSetting = createAction(
    '[Settings] Update Setting',
    props<{ name: string; value: any }>(),
);
