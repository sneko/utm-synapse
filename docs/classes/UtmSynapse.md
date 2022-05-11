# Class: UtmSynapse

Its instance allows you to deal with UTM parameters

## Table of contents

### Constructors

- [constructor](UtmSynapse.md#constructor)

### Properties

- [StorageKey](UtmSynapse.md#storagekey)

### Methods

- [cleanDisplayedUrl](UtmSynapse.md#cleandisplayedurl)
- [clear](UtmSynapse.md#clear)
- [load](UtmSynapse.md#load)
- [parse](UtmSynapse.md#parse)
- [save](UtmSynapse.md#save)
- [setIntoUrl](UtmSynapse.md#setintourl)
- [trimUrl](UtmSynapse.md#trimurl)

## Constructors

### constructor

• **new UtmSynapse**()

#### Defined in

[index.ts:24](https://github.com/sneko/utm-synapse/blob/main/src/index.ts#L24)

## Properties

### StorageKey

▪ `Static` `Readonly` **StorageKey**: `string` = `'utmParams'`

#### Defined in

[index.ts:21](https://github.com/sneko/utm-synapse/blob/main/src/index.ts#L21)

## Methods

### cleanDisplayedUrl

▸ **cleanDisplayedUrl**(): `void`

Will ask the browser to remove UTM parameters without reloading the page.
Can be useful to avoid users doing copy/paste with UTM parameters

Tip: you should save parameters before doing this (because they would be lost otherwise)
Note: if the history browser feature is not accessible it won't work

#### Returns

`void`

#### Defined in

[index.ts:145](https://github.com/sneko/utm-synapse/blob/main/src/index.ts#L145)

___

### clear

▸ **clear**(): `void`

Clear the storage of any UTM parameter

#### Returns

`void`

#### Defined in

[index.ts:114](https://github.com/sneko/utm-synapse/blob/main/src/index.ts#L114)

___

### load

▸ **load**(): ``null`` \| `Partial`<`Record`<[`UtmParamEnum`](../enums/UtmParamEnum.md), `string`\>\>

Load any UTM parameter in the storage

#### Returns

``null`` \| `Partial`<`Record`<[`UtmParamEnum`](../enums/UtmParamEnum.md), `string`\>\>

#### Defined in

[index.ts:103](https://github.com/sneko/utm-synapse/blob/main/src/index.ts#L103)

___

### parse

▸ **parse**(`url?`): ``null`` \| `Partial`<`Record`<[`UtmParamEnum`](../enums/UtmParamEnum.md), `string`\>\>

Extract UTM parameters from a URL or by default `window.location.href`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url?` | `string` |

#### Returns

``null`` \| `Partial`<`Record`<[`UtmParamEnum`](../enums/UtmParamEnum.md), `string`\>\>

#### Defined in

[index.ts:38](https://github.com/sneko/utm-synapse/blob/main/src/index.ts#L38)

___

### save

▸ **save**(`params`): `void`

Save UTM parameters for later usage

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Partial`<`Record`<[`UtmParamEnum`](../enums/UtmParamEnum.md), `string`\>\> |

#### Returns

`void`

#### Defined in

[index.ts:60](https://github.com/sneko/utm-synapse/blob/main/src/index.ts#L60)

___

### setIntoUrl

▸ **setIntoUrl**(`url`, `params`): `string`

Will add provided parameters to the URL

Note: in case the URL already contains one of those parameters already, we remove all the original ones before patching (to not mix different analytics sessions)

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `params` | `Partial`<`Record`<[`UtmParamEnum`](../enums/UtmParamEnum.md), `string`\>\> |

#### Returns

`string`

#### Defined in

[index.ts:161](https://github.com/sneko/utm-synapse/blob/main/src/index.ts#L161)

___

### trimUrl

▸ **trimUrl**(`url`): `string`

Remove UTM parameters from an URL

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`string`

#### Defined in

[index.ts:123](https://github.com/sneko/utm-synapse/blob/main/src/index.ts#L123)
