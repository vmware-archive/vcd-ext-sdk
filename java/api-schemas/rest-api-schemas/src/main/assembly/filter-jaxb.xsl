<?xml version="1.0"?>
<!--
   Filter JAXB specific attributes from XSD files.
  -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:jaxb="http://java.sun.com/xml/ns/jaxb" version="1.0">
  <xsl:template match="xs:schema">
    <xsl:copy>
      <xsl:for-each select="@*[namespace-uri(.) != 'http://java.sun.com/xml/ns/jaxb']">
        <xsl:copy-of select="."/>
      </xsl:for-each>
      <xsl:copy-of select="node()"/>
    </xsl:copy>
  </xsl:template>
  <xsl:template match="comment()">
    <xsl:copy-of select="."/>
  </xsl:template>
</xsl:stylesheet>
