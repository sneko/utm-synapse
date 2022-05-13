import MemoryStorage from 'memorystorage';

export enum UtmParamEnum {
  Source = 'utm_source',
  Medium = 'utm_medium',
  Campaign = 'utm_campaign',
  Content = 'utm_content',
  Name = 'utm_name',
  Term = 'utm_term',
  InitialSource = 'initial_utm_source',
  InitialMedium = 'initial_utm_medium',
  InitialCampaign = 'initial_utm_campaign',
  InitialContent = 'initial_utm_content',
  InitialName = 'initial_utm_name',
  InitialTerm = 'initial_utm_term',
  Gclid = 'gclid',
}

export type UtmParams = Partial<Record<UtmParamEnum, string>>;

/** Its instance allows you to deal with UTM parameters */
export class UtmSynapse {
  public static readonly StorageKey: string = 'utmParams';
  protected readonly storage: Storage | null;

  constructor() {
    // In the future we could allow customizing the `sessionStorage` key...

    // In case the storage is missing, log this plugin won't work normally
    if (typeof Storage === 'undefined') {
      console.warn(
        "Using the UTM package without having a storage won't work properly"
      );

      this.storage = new MemoryStorage();
    } else {
      this.storage = sessionStorage;
    }
  }

  /** Extract UTM parameters from a URL or by default `window.location.href` */
  public parse(url?: string): UtmParams | null {
    const parsedUrl = new URL(url || window.location.href);
    const urlParams = parsedUrl.searchParams;

    const utmParams: UtmParams = {};

    Object.values(UtmParamEnum).forEach(utmKey => {
      const value = urlParams.get(utmKey);

      if (value) {
        utmParams[utmKey] = value;
      }
    });

    if (!Object.keys(utmParams).length) {
      return null;
    }

    return utmParams;
  }

  /** Save UTM parameters for later usage */
  public save(params: UtmParams): void {
    if (!this.storage) {
      return;
    }

    // Load the existing params if any and patch with the input ones
    const previousParamsString = this.storage.getItem(UtmSynapse.StorageKey);

    const paramsToSave: UtmParams = JSON.parse(JSON.stringify(params));

    if (previousParamsString) {
      const previousParams: UtmParams = JSON.parse(previousParamsString);

      // If any "initial" in the input params, we ignored keeping the previous saved ones
      const mapInitialKeys = {
        [UtmParamEnum.Source]: UtmParamEnum.InitialSource,
        [UtmParamEnum.Medium]: UtmParamEnum.InitialMedium,
        [UtmParamEnum.Campaign]: UtmParamEnum.InitialCampaign,
        [UtmParamEnum.Content]: UtmParamEnum.InitialContent,
        [UtmParamEnum.Name]: UtmParamEnum.InitialName,
        [UtmParamEnum.Term]: UtmParamEnum.InitialTerm,
      };

      const intersectionArray = Object.values(mapInitialKeys).filter(value =>
        Object.keys(params).includes(value)
      );

      if (!intersectionArray.length) {
        const paramsToLookFor = Object.keys(mapInitialKeys);

        for (const [key, value] of Object.entries(previousParams)) {
          if (paramsToLookFor.includes(key)) {
            const convertedKey: UtmParamEnum = (mapInitialKeys as any)[key];
            paramsToSave[convertedKey] = value;
          }
        }
      }
    }

    this.storage.setItem(UtmSynapse.StorageKey, JSON.stringify(paramsToSave));
  }

  /** Load any UTM parameter in the storage */
  public load(): UtmParams | null {
    if (!this.storage) {
      return null;
    }

    const utmParams = this.storage.getItem(UtmSynapse.StorageKey);

    return utmParams ? (JSON.parse(utmParams) as UtmParams) : null;
  }

  /** Clear the storage of any UTM parameter */
  public clear(): void {
    if (!this.storage) {
      return;
    }

    this.storage.removeItem(UtmSynapse.StorageKey);
  }

  /** Remove UTM parameters from an URL  */
  public trimUrl(url: string): string {
    const parsedUrl = new URL(url);
    const urlParams = parsedUrl.searchParams;

    if (!urlParams) {
      return url;
    }

    for (const paramKey of Object.values(UtmParamEnum)) {
      urlParams.delete(paramKey);
    }

    return parsedUrl.toString();
  }

  /**
   * Will ask the browser to remove UTM parameters without reloading the page.
   * Can be useful to avoid users doing copy/paste with UTM parameters
   *
   * Tip: you should save parameters before doing this (because they would be lost otherwise)
   * Note: if the history browser feature is not accessible it won't work
   */
  public cleanDisplayedUrl(): void {
    if (!window || !history) {
      return;
    }

    const trimmedUrl = this.trimUrl(window.location.href);

    const previousState = history.state;
    history.replaceState(previousState, '', trimmedUrl);
  }

  /**
   * Will add provided parameters to the URL
   *
   * Note: in case the URL already contains one of those parameters already, we remove all the original ones before patching (to not mix different analytics sessions)
   */
  public setIntoUrl(url: string, params: UtmParams): string {
    const cleanUrlToPatch = this.trimUrl(url);
    const parsedUrl = new URL(cleanUrlToPatch);
    const urlParams = parsedUrl.searchParams;

    for (const [key, value] of Object.entries(params)) {
      if (value) {
        urlParams.append(key, value);
      }
    }

    return parsedUrl.toString();
  }
}

/** Default global instance for the ease of use */
export const utmSynapse = new UtmSynapse();
