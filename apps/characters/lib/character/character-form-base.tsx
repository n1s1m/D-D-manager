'use client';

import type { Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui-components';
import type { CharacterFormValues } from '@/lib/character/character-form-schema';
import { FormNumberField, FormTextField } from '@/lib/form-fields';

const ABILITY_STATS = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const;

interface CharacterFormBaseProps {
  control: Control<CharacterFormValues>;
  errors: FieldErrors<CharacterFormValues>;
  setValue: UseFormSetValue<CharacterFormValues>;
  watch: UseFormWatch<CharacterFormValues>;
  classes: { id: string; name: string }[];
  races: { id: string; name: string }[];
  /** When true, includes gold field (e.g. for edit form). */
  includeGold?: boolean;
}

export function CharacterFormBase({
  control,
  errors,
  setValue,
  watch,
  classes,
  races,
  includeGold = false,
}: CharacterFormBaseProps) {
  return (
    <>
      <FormTextField control={control} name="name" label="Name" error={errors.name?.message} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="class_id">Class</Label>
          <Select value={watch('class_id')} onValueChange={(v) => setValue('class_id', v)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="race_id">Race</Label>
          <Select value={watch('race_id')} onValueChange={(v) => setValue('race_id', v)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Race" />
            </SelectTrigger>
            <SelectContent>
              {races.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormNumberField
          control={control}
          name="level"
          label="Level"
          min={1}
          max={20}
          error={errors.level?.message}
        />
        {includeGold && (
          <FormNumberField
            control={control}
            name="gold"
            label="Gold (gp)"
            min={0}
            error={errors.gold?.message}
          />
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FormNumberField
          control={control}
          name="armor_class"
          label="AC"
          min={0}
          error={errors.armor_class?.message}
        />
        <FormNumberField
          control={control}
          name="hit_points_max"
          label="HP max"
          min={1}
          error={errors.hit_points_max?.message}
        />
        <FormNumberField
          control={control}
          name="hit_points_current"
          label="HP current"
          min={0}
          error={errors.hit_points_current?.message}
        />
        <FormNumberField
          control={control}
          name="speed_ft"
          label="Speed (ft)"
          min={0}
          error={errors.speed_ft?.message}
        />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3">Ability scores</h2>
        <div className="grid grid-cols-3 gap-4">
          {ABILITY_STATS.map((stat) => (
            <FormNumberField
              key={stat}
              control={control}
              name={stat}
              label={stat.charAt(0).toUpperCase() + stat.slice(1)}
              min={1}
              max={30}
              error={errors[stat]?.message}
            />
          ))}
        </div>
      </div>
    </>
  );
}
