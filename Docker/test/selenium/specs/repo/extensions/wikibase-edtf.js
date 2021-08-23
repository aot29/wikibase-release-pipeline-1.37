'use strict';

const assert = require( 'assert' );
const WikibaseApi = require( 'wdio-wikibase/wikibase.api' );
const defaultFunctions = require( '../../../helpers/default-functions' );

describe( 'WikibaseEdtf', function () {

	let propertyId, itemId;

	it( 'Should allow to create the EDTF property', function () {

		defaultFunctions.skipIfExtensionNotPresent( this, 'WikibaseEdtf' );

		propertyId = browser.call( () => WikibaseApi.createProperty( 'edtf' ) );
		assert( propertyId.startsWith( 'P' ) === true );
	} );

	it( 'Should allow to use the new property', function () {

		defaultFunctions.skipIfExtensionNotPresent( this, 'WikibaseEdtf' );

		const rawValue = '1985-04-12T23:20:30';

		const data = {
			claims: [
				{
					mainsnak: {
						snaktype: 'value',
						property: propertyId,
						datavalue: { value: rawValue, type: 'string' } },
					type: 'statement', rank: 'normal'
				}
			]
		};

		itemId = browser.call(
			() => WikibaseApi.createItem( 'image-test', data )
		);

		// go look at wikibase
		const response = browser.makeRequest( process.env.MW_SERVER + '/wiki/Special:EntityData/' + itemId + '.json' );
		const responseSnak = response.data.entities[ itemId ].claims[ propertyId ][ 0 ].mainsnak;

		assert( responseSnak.datavalue.value === '1985-04-12T23:20:30' );
		assert( responseSnak.datatype === 'edtf' );

		// for a pretty screenshot
		browser.url( process.env.MW_SERVER + '/wiki/Item:' + itemId );
	} );

} );
