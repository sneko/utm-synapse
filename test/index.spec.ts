import { UtmParamEnum, UtmParams, UtmSynapse, utmSynapse } from '../src';

describe('UtmSynapse', () => {
  let utmSynapse: UtmSynapse;

  beforeEach(async () => {
    utmSynapse = new UtmSynapse();
  });

  afterEach(async () => {
    utmSynapse.clear();
  });

  it('should have the global instance', () => {
    expect(utmSynapse).not.toBeNull();
  });

  describe('parse()', () => {
    it('should return UTM parameters', () => {
      const utmParams = utmSynapse.parse(
        'https://domain.com/?signal=hello&utm_source=hello'
      );

      expect(utmParams).toStrictEqual({ utm_source: 'hello' });
    });

    it('should return null', () => {
      const utmParams = utmSynapse.parse('https://domain.com/?signal=hello');

      expect(utmParams).toBeNull();
    });
  });

  describe('save()', () => {
    it('should save', () => {
      const inputParams: UtmParams = {
        [UtmParamEnum.Source]: 'git',
        [UtmParamEnum.Medium]: 'referral',
        [UtmParamEnum.Campaign]: 'summer-2022',
      };

      utmSynapse.save(inputParams);

      const retrievedItem = sessionStorage.getItem(UtmSynapse.StorageKey);

      expect(retrievedItem).not.toBeNull();
      expect(JSON.parse(retrievedItem as string)).toStrictEqual(inputParams);
    });

    it('should save and patch', () => {
      const inputParams1: UtmParams = {
        [UtmParamEnum.Source]: 'git',
        [UtmParamEnum.Medium]: 'referral',
        [UtmParamEnum.Campaign]: 'summer-2022',
      };

      const inputParams2: UtmParams = {
        [UtmParamEnum.Source]: 'facebook',
        [UtmParamEnum.Medium]: 'referral',
        [UtmParamEnum.Campaign]: 'summer-2022',
      };

      utmSynapse.save(inputParams1);
      utmSynapse.save(inputParams2);

      const retrievedItem = sessionStorage.getItem(UtmSynapse.StorageKey);

      expect(retrievedItem).not.toBeNull();
      expect(
        JSON.parse(retrievedItem as string)[UtmParamEnum.InitialSource]
      ).toBe(inputParams1[UtmParamEnum.Source]);
      expect(JSON.parse(retrievedItem as string)[UtmParamEnum.Source]).toBe(
        inputParams2[UtmParamEnum.Source]
      );
    });
  });

  describe('load()', () => {
    it('should load nothing', () => {
      expect(utmSynapse.load()).toBeNull();
    });

    it('should load data', () => {
      const utmParams = {};

      utmSynapse.save(utmParams);

      expect(utmSynapse.load()).toStrictEqual(utmParams);
    });
  });

  describe('clear()', () => {
    it('should clear', () => {
      sessionStorage.setItem(UtmSynapse.StorageKey, '{}');

      utmSynapse.clear();

      expect(sessionStorage.getItem(UtmSynapse.StorageKey)).toBeNull();
    });
  });

  describe('trimUrl()', () => {
    it('should trim UTM parameters in the URL', () => {
      const trimmedUrl = utmSynapse.trimUrl(
        'https://domain.com/?signal=hello&utm_source=hello'
      );

      expect(trimmedUrl).toBe('https://domain.com/?signal=hello');
    });
  });

  describe('cleanDisplayedUrl()', () => {
    it('should trim UTM parameters in the browser URL', () => {
      const testedUrl = 'https://domain.com/?signal=hello&utm_source=hello';
      const expectedurl = 'https://domain.com/?signal=hello';

      // Mock system properties
      window = Object.create(window);

      Object.defineProperty(window, 'location', {
        value: {
          href: testedUrl,
        },
      });

      (window as any).testCtx = {
        location: function (prop: any, val: any) {
          Object.defineProperty(window.location, prop, {
            writable: true,
            value: val,
          });
        },
      };

      (window as any).testCtx.location('href', testedUrl);
      jest.spyOn(window.history, 'replaceState');
      (window as any).history.replaceState.mockImplementation(
        (state: any, title: string, url: string) => {
          (window as any).testCtx.location('href', url);
        }
      );

      utmSynapse.cleanDisplayedUrl();

      expect(window.location.href).toBe(expectedurl);
    });
  });

  describe('setIntoUrl()', () => {
    const inputParams: UtmParams = {
      [UtmParamEnum.Source]: 'git',
      [UtmParamEnum.Medium]: 'referral',
      [UtmParamEnum.Campaign]: 'summer-2022',
    };

    const expectedUrl =
      'https://domain.com/?utm_source=git&utm_medium=referral&utm_campaign=summer-2022';

    it('should add UTM parameters in the URL', () => {
      const originalUrl = 'https://domain.com/';

      const enhancedUrl = utmSynapse.setIntoUrl(originalUrl, inputParams);

      expect(enhancedUrl).toBe(expectedUrl);
    });

    it('should add UTM parameters in the URL while cleaning old UTM parameters', () => {
      const originalUrl = 'https://domain.com/?utm_source=facebook';

      const enhancedUrl = utmSynapse.setIntoUrl(originalUrl, inputParams);

      expect(enhancedUrl).toBe(expectedUrl);
    });
  });
});
